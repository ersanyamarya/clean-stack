import { Schema } from 'mongoose';
import { AllowedWeatherConditions, PedestrianData, PedestrianEntity, PedestrianZone } from './pedestrian_data.types';

const GeoPoint2DSchema = new Schema(
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

export const pedestrianDataSchema = new Schema<PedestrianData>(
  {
    timestamp: { type: Number, required: true },
    weather_condition: {
      type: String,
      enum: AllowedWeatherConditions,
    },
    temperature: { type: Number },
    pedestrians_count: { type: Number, required: true },
    unverified: { type: Number, default: 0 },
    location_id: { type: Number, required: true },
    location_name: { type: String, required: true },
    geo_point_2d: { type: GeoPoint2DSchema, required: true },
    details_ltr_pedestrians_count: { type: Number, default: null },
    details_rtl_pedestrians_count: { type: Number, default: null },
    details_adult_pedestrians_count: { type: Number, default: null },
    details_child_pedestrians_count: { type: Number, default: null },
    details_adult_ltr_pedestrians_count: { type: Number, default: null },
    details_adult_rtl_pedestrians_count: { type: Number, default: null },
    details_child_ltr_pedestrians_count: { type: Number, default: null },
    details_child_rtl_pedestrians_count: { type: Number, default: null },
    details_zones: { type: [pedestrianZoneSchema], default: null },
  },
  { _id: false }
);

export const pedestrianSchema = new Schema<PedestrianEntity>(
  {
    type: { type: String, required: true, default: 'Feature' },
    geometry: {
      type: { type: String, required: true, default: 'Polygon' },
      coordinates: { type: [[[Number]]], required: true },
    },
    properties: { type: pedestrianDataSchema, required: true },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

pedestrianSchema.pre('save', function (next) {
  const timestamp = this.properties.timestamp;
  const date = new Date(timestamp);
  this.createdAt = date;
  this.updatedAt = date;
  next();
});
