import { Connection, FilterQuery, Model, PipelineStage, Types, models } from 'mongoose';
import { PedestrianDataRepository } from './pedestrian_data.repository';
import { pedestrianSchema } from './pedestrian_data.schema';
import { PaginatedResult, PaginationOptions, PedestrianCreateInput, PedestrianEntity } from './pedestrian_data.types';

export const createPedestrianMongoRepository = (connection: Connection): PedestrianDataRepository => {
  const PedestrianModel: Model<PedestrianEntity> = models['Pedestrian'] || connection.model<PedestrianEntity>('Pedestrian', pedestrianSchema);

  const listPedestrianData = async (filter: FilterQuery<PedestrianEntity>): Promise<PedestrianEntity[]> => {
    return PedestrianModel.find(filter).exec();
  };

  const paginatePedestrianData = async (
    filter: FilterQuery<PedestrianEntity>,
    { page, limit }: PaginationOptions
  ): Promise<PaginatedResult<PedestrianEntity>> => {
    const [data, total] = await Promise.all([
      PedestrianModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      PedestrianModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

  const createPedestrianData = async (pedestrianData: PedestrianCreateInput): Promise<PedestrianEntity> => {
    const newPedestrianData = new PedestrianModel(pedestrianData);
    return newPedestrianData.save();
  };

  const deletePedestrianData = async (id: string): Promise<boolean> => {
    const objectId = new Types.ObjectId(id);
    const result = await PedestrianModel.deleteOne({ _id: objectId }).exec();
    return result.deletedCount === 1;
  };

  const aggregatePedestrianData = async <T>(pipeline: PipelineStage[]): Promise<T> => {
    return PedestrianModel.aggregate(pipeline).exec() as unknown as T;
  };

  return {
    listPedestrianData,
    paginatePedestrianData,
    createPedestrianData,
    deletePedestrianData,
    aggregatePedestrianData,
  };
};
