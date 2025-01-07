import { Types } from 'mongoose';

export type PedestrianZone = {
  id: number;
  pedestrians_count: number;
  ltr_pedestrians_count: number;
  rtl_pedestrians_count: number;
  adult_pedestrians_count: number;
  child_pedestrians_count: number;
};

export type PedestrianEntity = {
  _id: Types.ObjectId;
  timestamp: number;
  weather_condition: string;
  temperature: number;
  pedestrians_count: number;
  location_id: number;
  location_name: string;
  geo_point_2d: {
    lon: number;
    lat: number;
  };
  details_ltr_pedestrians_count: number;
  details_rtl_pedestrians_count: number;
  details_adult_pedestrians_count: number;
  details_child_pedestrians_count: number;
  details_adult_ltr_pedestrians_count: number;
  details_adult_rtl_pedestrians_count: number;
  details_child_ltr_pedestrians_count: number;
  details_child_rtl_pedestrians_count: number;
  details_zones: PedestrianZone[];
  geometry: {
    coordinates: number[][][];
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

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
