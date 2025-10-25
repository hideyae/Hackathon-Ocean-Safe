export type ActivityType = 'surfing' | 'fishing' | 'diving' | 'sailing' | 'kayaking' | 'swimming';

export interface LocationCoordinates {
  lat: number;
  lon: number;
  display_name: string;
}

export interface OceanVariable {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'safe' | 'moderate' | 'warning' | 'danger';
  statusText: string;
  recommendation: string;
  icon: string;
}

export interface ActivityCondition {
  activity: ActivityType;
  location: string;
  date: string;
  score: number;
  overall: string;
  details: string;
  safety: string[];
  variables: OceanVariable[];
  latitude?: number;
  longitude?: number;
  weather?: WeatherData;
  tide?: TideData;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface ActivityHistory {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  score: number;
  overall_status: string;
  conditions_data: any;
  created_at: string;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface WeatherData {
  temp: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  clouds: number;
  visibility: number;
}

export interface TideData {
  height: number;
  type: 'high' | 'low';
  time: string;
  next: {
    height: number;
    type: 'high' | 'low';
    time: string;
  };
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  display_name: string;
}

export interface FishSpecies {
  id: string;
  name: string;
  scientific_name: string;
  status: string;
  breeding_months: number[];
  description: string;
  image_url?: string;
  threat_level: string;
  created_at: string;
}

export interface ConservationAlert {
  id: string;
  user_id: string;
  fish_species_id?: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  fish_species?: FishSpecies;
}
