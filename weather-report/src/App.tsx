import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { WeatherTileGrid } from '@/components/weather/WeatherTileGrid';
import { NewsHero } from '@/components/news/NewsHero';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsTileGrid } from '@/components/news/NewsTileGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useNews } from '@/hooks/useNews';
import { useStats } from '@/hooks/useStats';
import { useNewsStats } from '@/hooks/useNewsStats';
import { useAppStore } from '@/store/appStore';
import { config } from '@/utils/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: config.retryDelay,
      staleTime: config.cacheDuration,
    },
  },
});

function WeatherContent() {
  const selectedCity = useAppStore((state) => state.selectedCity);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);
  const addUnavailableCity = useAppStore((state) => state.addUnavailableCity);
  const clearPreparingCity = useAppStore((state) => state.clearPreparingCity);
  const unavailableCities = useAppStore((state) => state.unavailableCities);
  const { data, isLoading, isError, error } = useWeather(selectedCity);
  const { data: statsData } = useStats();

  // Build tile list: preparing cities first, then active cities from stats
  const cityTiles = useMemo(() => {
    const activeCities = Object.entries(statsData?.statistics.active_cities ?? {}).map(
      ([city, detail]) => ({
        city,
        imageUrl: detail.image_url ?? undefined,
        isPreparing: false,
      })
    );
    const preparingTiles = unavailableCities
      .filter((c) => !activeCities.some((a) => a.city.toLowerCase() === c.toLowerCase()))
      .map((city) => ({ city, imageUrl: undefined, isPreparing: true }));
    return [...preparingTiles, ...activeCities];
  }, [statsData, unavailableCities]);

  // When stats shows a preparing city is now active, clear its preparing state
  useEffect(() => {
    if (!statsData) return;
    const activeCities = statsData.statistics.active_cities ?? {};
    unavailableCities.forEach((city) => {
      const isNowActive = Object.keys(activeCities).some(
        (k) => k.toLowerCase() === city.toLowerCase()
      );
      if (isNowActive) {
        clearPreparingCity(city);
      }
    });
  }, [statsData, unavailableCities, clearPreparingCity]);

  // Mark city as unavailable when 404 occurs
  useEffect(() => {
    if (isError && selectedCity) {
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      if (errorMessage.includes('forecast not found')) {
        addUnavailableCity(selectedCity);
      }
    }
  }, [isError, error, selectedCity, addUnavailableCity]);

  if (!selectedCity) {
    return (
      <WeatherTileGrid
        cities={cityTiles}
        onCitySelect={setSelectedCity}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <WeatherHero city={data.city} imageUrl={data.forecast.image_url ?? undefined} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ForecastCard forecast={data.forecast} city={data.city} />
      </div>
    </>
  );
}

function NewsContent() {
  const selectedSubreddit = useAppStore((state) => state.selectedSubreddit);
  const setSelectedSubreddit = useAppStore((state) => state.setSelectedSubreddit);
  const addUnavailableSubreddit = useAppStore((state) => state.addUnavailableSubreddit);
  const clearPreparingSubreddit = useAppStore((state) => state.clearPreparingSubreddit);
  const unavailableSubreddits = useAppStore((state) => state.unavailableSubreddits);
  const { data, isLoading, isError, error } = useNews(selectedSubreddit);
  const { data: statsData } = useNewsStats();

  // Build tile list: preparing subreddits first, then active subreddits from stats
  const subredditTiles = useMemo(() => {
    const activeSubreddits = Object.entries(statsData?.statistics.active_categories ?? {}).map(
      ([subreddit, detail]) => ({
        subreddit,
        imageUrl: detail.image_url ?? undefined,
        isPreparing: false,
      })
    );
    const preparingTiles = unavailableSubreddits
      .filter(
        (s) => !activeSubreddits.some((a) => a.subreddit.toLowerCase() === s.toLowerCase())
      )
      .map((subreddit) => ({ subreddit, imageUrl: undefined, isPreparing: true }));
    return [...preparingTiles, ...activeSubreddits];
  }, [statsData, unavailableSubreddits]);

  // When stats shows a preparing subreddit is now active, clear its preparing state
  useEffect(() => {
    if (!statsData) return;
    const activeCategories = statsData.statistics.active_categories ?? {};
    unavailableSubreddits.forEach((subreddit) => {
      const isNowActive = Object.keys(activeCategories).some(
        (k) => k.toLowerCase() === subreddit.toLowerCase()
      );
      if (isNowActive) {
        clearPreparingSubreddit(subreddit);
      }
    });
  }, [statsData, unavailableSubreddits, clearPreparingSubreddit]);

  // Mark subreddit as unavailable when 404 occurs
  useEffect(() => {
    if (isError && selectedSubreddit) {
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      if (errorMessage.includes('news not found')) {
        addUnavailableSubreddit(selectedSubreddit);
      }
    }
  }, [isError, error, selectedSubreddit, addUnavailableSubreddit]);

  if (!selectedSubreddit) {
    return (
      <NewsTileGrid
        subreddits={subredditTiles}
        onSubredditSelect={setSelectedSubreddit}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <NewsHero
        subreddit={selectedSubreddit}
        title={data.news.title}
        imageUrl={data.news.image_url}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsCard news={data.news} subreddit={selectedSubreddit} />
      </div>
    </>
  );
}

function App() {
  const activeTab = useAppStore((state) => state.activeTab);

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="min-h-screen flex items-center justify-center bg-apple-light dark:bg-black">
          <ErrorMessage error={error} />
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-apple-light dark:bg-black">
          <Header />
          <main>
            {activeTab === 'weather' ? <WeatherContent /> : <NewsContent />}
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
