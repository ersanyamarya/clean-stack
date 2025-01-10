import { Types } from 'mongoose';

export const AllowedWeatherConditions = [
  'rain',
  'cloudy',
  'partly-cloudy-night',
  'partly-cloudy-day',
  'clear-night',
  'snow',
  'clear-day',
  'wind',
  'fog',
] as const;

type GeoPoint2D = {
  lon: number;
  lat: number;
};

type WeatherCondition = (typeof AllowedWeatherConditions)[number];

type GeoPolygon = {
  type: 'Polygon';
  coordinates: [[[number, number]]];
};
export type PedestrianZone = {
  id: number;
  pedestrians_count: number;
  ltr_pedestrians_count: number;
  rtl_pedestrians_count: number;
  adult_pedestrians_count: number;
  child_pedestrians_count: number;
};
interface PedestrianDetails {
  details_ltr_pedestrians_count: number | null;
  details_rtl_pedestrians_count: number | null;
  details_adult_pedestrians_count: number | null;
  details_child_pedestrians_count: number | null;
  details_adult_ltr_pedestrians_count: number | null;
  details_adult_rtl_pedestrians_count: number | null;
  details_child_ltr_pedestrians_count: number | null;
  details_child_rtl_pedestrians_count: number | null;
  details_zones: [PedestrianZone] | null;
}

export interface PedestrianData extends PedestrianDetails {
  timestamp: number;
  weather_condition: WeatherCondition;
  temperature: number;
  pedestrians_count: number;
  unverified: number;
  location_id: number;
  location_name: string;
  geo_point_2d: GeoPoint2D;
}

export interface PedestrianEntity {
  _id: Types.ObjectId;
  type: string;
  geometry: GeoPolygon;
  properties: PedestrianData;
  createdAt: Date;
  updatedAt: Date;
}

export type PedestrianCreateInput = Omit<PedestrianEntity, '_id' | 'createdAt' | 'updatedAt'>;
export type PaginationOptions = {
  page: number;
  limit: number;
};
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
