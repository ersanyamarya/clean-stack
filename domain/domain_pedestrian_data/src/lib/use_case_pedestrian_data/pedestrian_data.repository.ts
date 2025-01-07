import { FilterQuery, PipelineStage } from 'mongoose';
import { PaginatedResult, PaginationOptions, PedestrianCreateInput, PedestrianEntity } from './pedestrian_data.types';

export interface PedestrianDataRepository {
  listPedestrianData: (filter: FilterQuery<PedestrianEntity>) => Promise<PedestrianEntity[]>;
  paginatePedestrianData: (filter: FilterQuery<PedestrianEntity>, options: PaginationOptions) => Promise<PaginatedResult<PedestrianEntity>>;
  createPedestrianData: (pedestrianData: PedestrianCreateInput) => Promise<PedestrianEntity>;
  deletePedestrianData: (id: string) => Promise<boolean>;
  aggregatePedestrianData: <T>(pipeline: PipelineStage[]) => Promise<T>;
}
