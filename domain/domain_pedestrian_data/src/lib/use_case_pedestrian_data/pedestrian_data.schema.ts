import { Schema } from 'mongoose';
import { PedestrianEntity, PedestrianZone } from './pedestrian_data.types';

const geoPointSchema = new Schema(
  {
    lon: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  { _id: false }
);

const pedestrianZoneSchema = new Schema<PedestrianZone>(
  {
    id: { type: Number, required: true },
    pedestrians_count: { type: Number, required: true },
    ltr_pedestrians_count: { type: Number, required: true },
    rtl_pedestrians_count: { type: Number, required: true },
    adult_pedestrians_count: { type: Number, required: true },
    child_pedestrians_count: { type: Number, required: true },
  },
  { _id: false }
);

export const pedestrianSchema = new Schema<PedestrianEntity>(
  {
    timestamp: { type: Number, required: true },
    weather_condition: { type: String, required: true },
    temperature: { type: Number, required: true },
    pedestrians_count: { type: Number, required: true },
    location_id: { type: Number, required: true },
    location_name: { type: String, required: true },
    geo_point_2d: { type: geoPointSchema, required: true },
    details_ltr_pedestrians_count: { type: Number, required: true },
    details_rtl_pedestrians_count: { type: Number, required: true },
    details_adult_pedestrians_count: { type: Number, required: true },
    details_child_pedestrians_count: { type: Number, required: true },
    details_adult_ltr_pedestrians_count: { type: Number, required: true },
    details_adult_rtl_pedestrians_count: { type: Number, required: true },
    details_child_ltr_pedestrians_count: { type: Number, required: true },
    details_child_rtl_pedestrians_count: { type: Number, required: true },
    details_zones: [{ type: pedestrianZoneSchema, required: true }],
    geometry: {
      coordinates: { type: [[[Number]]], required: true },
      type: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

pedestrianSchema.pre('save', function (next) {
  const timestamp = this.timestamp;
  const date = new Date(timestamp);
  this.createdAt = date;
  this.updatedAt = date;
  next();
});
