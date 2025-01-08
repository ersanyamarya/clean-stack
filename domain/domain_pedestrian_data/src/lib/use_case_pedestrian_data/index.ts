import { Connection, Model, models } from 'mongoose';
import { createPedestrianMongoRepository } from './pedestrian_data.mongodb.repository';
import { pedestrianSchema } from './pedestrian_data.schema';
import { PedestrianEntity } from './pedestrian_data.types';

const getPedestrianModel = (connection: Connection): Model<PedestrianEntity> => {
  const PedestrianDataMongooseModel: Model<PedestrianEntity> = models['Pedestrian'] || connection.model<PedestrianEntity>('Pedestrian', pedestrianSchema);
  return PedestrianDataMongooseModel as Model<PedestrianEntity>;
};

export { createPedestrianMongoRepository, getPedestrianModel, pedestrianSchema };
