// Generated TypeScript types from OpenAPI specification

export interface WeatherResponse {
  status: string;
  city: string;
  forecast: ForecastData;
}

export interface ForecastData {
  id: string;
  city: string;
  content: string;
  forecast_at: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
  age_seconds: number;
  audio_url: string | null;
  audio_format: string | null;
  audio_size_bytes: number | null;
  image_url: string | null;
  image_format: string | null;
  image_size_bytes: number | null;
  metadata: ForecastMetadata;
  record_metadata?: Record<string, unknown>;
}

export interface ForecastMetadata {
  encoding: string;
  language: string | null;
  locale: string | null;
  sizes: {
    text?: number;
    audio?: number;
    image?: number;
  };
}

export interface HistoryResponse {
  status: string;
  city: string;
  count: number;
  forecasts: HistoricalForecast[];
}

export interface HistoricalForecast {
  id: string;
  city: string;
  forecast_at: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
  text_language: string | null;
  text_size_bytes: number | null;
  has_audio: boolean;
  has_image: boolean;
}

export interface StatsResponse {
  status: string;
  statistics: StorageStatistics;
}

export interface StorageStatistics {
  total_forecasts: number;
  total_text_bytes: number;
  total_audio_bytes: number;
  total_image_bytes: number;
  forecasts_with_images: number;
  languages_used: Record<string, number>;
  cities_used: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  database: DatabaseHealth;
  api_version: string;
}

export interface DatabaseHealth {
  connected: boolean;
  supabase_url: string | null;
  database: string | null;
  version: string | null;
  table_exists: boolean | null;
  record_count: number | null;
  error: string | null;
}

export interface ErrorResponse {
  status: string;
  message: string;
  detail?: Record<string, unknown> | null;
}

export interface WeatherNotFoundResponse {
  status: string;
  message: string;
}

// News API Types
export interface NewsResponse {
  status: string;
  subreddit?: string;
  report_type?: string;
  news: NewsData;
}

export interface NewsListResponse {
  status: string;
  subreddit?: string;
  report_type?: string;
  count: number;
  news: NewsSummary[];
}

export interface NewsData {
  id: string;
  title?: string;
  content: string;
  summary?: string;
  source?: string;
  category?: string;
  published_at: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  age_seconds: number;
  audio_url?: string;
  audio_format?: string;
  audio_size_bytes?: number;
  audio_duration_seconds?: number;
  image_url?: string;
  image_format?: string;
  image_size_bytes?: number;
  tags: string[];
  metadata: NewsMetadata;
  record_metadata?: Record<string, unknown>;
}

export interface NewsMetadata {
  encoding: string;
  language?: string;
  locale?: string;
  sizes: {
    text?: number;
    summary?: number;
    audio?: number;
    image?: number;
  };
}

export interface NewsSummary {
  id: string;
  title?: string;
  source?: string;
  category?: string;
  published_at: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  text_language?: string;
  text_size_bytes: number;
  has_audio: boolean;
  has_image: boolean;
  audio_duration_seconds?: number;
  tags: string[];
}

export interface NewsStatsResponse {
  status: string;
  statistics: NewsStatistics;
}

export interface NewsStatistics {
  total_reports: number;
  total_text_bytes: number;
  total_summary_bytes: number;
  total_audio_bytes: number;
  total_image_bytes: number;
  reports_with_audio: number;
  reports_with_images: number;
  expired_reports: number;
  categories_used: Record<string, number>;
  sources_used: Record<string, number>;
  languages_used: Record<string, number>;
}
