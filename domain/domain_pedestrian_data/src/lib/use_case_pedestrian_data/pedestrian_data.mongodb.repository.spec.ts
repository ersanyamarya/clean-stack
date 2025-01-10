import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createPedestrianMongoRepository } from './pedestrian_data.mongodb.repository';
import { PedestrianCreateInput } from './pedestrian_data.types';

describe('PedestrianMongoRepository', () => {
  let mongoServer: MongoMemoryServer;
  let repository: ReturnType<typeof createPedestrianMongoRepository>;
  let connection: mongoose.Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    connection = mongoose.connection;
    repository = createPedestrianMongoRepository(connection);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await connection.collection('pedestrians').deleteMany({});
  });

  const mockPedestrianData: PedestrianCreateInput = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[[123.456, 78.91]]],
    },
    properties: {
      timestamp: Date.now(),
      weather_condition: 'clear-day',
      temperature: 25,
      pedestrians_count: 10,
      unverified: 0,
      location_id: 1,
      location_name: 'Test Location',
      geo_point_2d: {
        lon: 123.456,
        lat: 78.91,
      },
      details_ltr_pedestrians_count: 5,
      details_rtl_pedestrians_count: 5,
      details_adult_pedestrians_count: 8,
      details_child_pedestrians_count: 2,
      details_adult_ltr_pedestrians_count: 4,
      details_adult_rtl_pedestrians_count: 4,
      details_child_ltr_pedestrians_count: 1,
      details_child_rtl_pedestrians_count: 1,
      details_zones: [
        {
          id: 1,
          pedestrians_count: 10,
          ltr_pedestrians_count: 5,
          rtl_pedestrians_count: 5,
          adult_pedestrians_count: 8,
          child_pedestrians_count: 2,
        },
      ],
    },
  };

  describe('createPedestrianData', () => {
    it('should create new pedestrian data', async () => {
      const data = await repository.createPedestrianData(mockPedestrianData);
      expect(data.type).toBe(mockPedestrianData.type);
      expect(data.properties).toMatchObject(mockPedestrianData.properties);
      expect(data._id).toBeDefined();
    });

    it('should set timestamps on creation', async () => {
      const data = await repository.createPedestrianData(mockPedestrianData);
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });
  });

  describe('listPedestrianData', () => {
    it('should list all pedestrian data', async () => {
      await repository.createPedestrianData(mockPedestrianData);
      await repository.createPedestrianData({
        ...mockPedestrianData,
        properties: {
          ...mockPedestrianData.properties,
          location_name: 'Another Location',
        },
      });

      const data = await repository.listPedestrianData({});
      expect(data).toHaveLength(2);
    });

    it('should filter pedestrian data', async () => {
      await repository.createPedestrianData(mockPedestrianData);
      await repository.createPedestrianData({
        ...mockPedestrianData,
        properties: {
          ...mockPedestrianData.properties,
          location_name: 'Another Location',
        },
      });

      const data = await repository.listPedestrianData({
        'properties.location_name': mockPedestrianData.properties.location_name,
      });
      expect(data).toHaveLength(1);
      expect(data[0].properties.location_name).toBe(mockPedestrianData.properties.location_name);
    });
  });

  describe('paginatePedestrianData', () => {
    it('should paginate pedestrian data', async () => {
      await Promise.all([
        repository.createPedestrianData(mockPedestrianData),
        repository.createPedestrianData({
          ...mockPedestrianData,
          properties: {
            ...mockPedestrianData.properties,
            location_name: 'Location 2',
          },
        }),
        repository.createPedestrianData({
          ...mockPedestrianData,
          properties: {
            ...mockPedestrianData.properties,
            location_name: 'Location 3',
          },
        }),
      ]);

      const result = await repository.paginatePedestrianData({}, { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(2);
    });

    it('should handle empty result set', async () => {
      const result = await repository.paginatePedestrianData({}, { page: 1, limit: 10 });
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('deletePedestrianData', () => {
    it('should delete pedestrian data', async () => {
      const created = await repository.createPedestrianData(mockPedestrianData);
      const result = await repository.deletePedestrianData(created._id.toString());
      expect(result).toBe(true);

      const data = await repository.listPedestrianData({ _id: created._id });
      expect(data).toHaveLength(0);
    });

    it('should return false for non-existent id', async () => {
      const result = await repository.deletePedestrianData(new mongoose.Types.ObjectId().toString());
      expect(result).toBe(false);
    });
  });

  describe('aggregatePedestrianData', () => {
    it('should aggregate pedestrian data', async () => {
      await repository.createPedestrianData(mockPedestrianData);
      await repository.createPedestrianData({
        ...mockPedestrianData,
        properties: {
          ...mockPedestrianData.properties,
          pedestrians_count: 20,
        },
      });

      const result = await repository.aggregatePedestrianData<{ _id: null; totalCount: number }>([
        {
          $group: {
            _id: null,
            totalCount: { $sum: '$properties.pedestrians_count' },
          },
        },
      ]);

      expect(result).toHaveLength(1);
    });
  });
});
