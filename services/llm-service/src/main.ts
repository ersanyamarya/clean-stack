import { mainLogger, telemetrySdk } from './init';

import { errorHandler } from '@clean-stack/custom-errors';

import { ServiceLLMService } from '@clean-stack/grpc-proto/llm';
import { Metadata, Server, ServerCredentials } from '@grpc/grpc-js';

import { AzureChatOpenAI } from '@langchain/openai';
import { llmServiceServer } from './service';

import { createMongoDBConnector, getMongoDBConnection } from '@clean-stack/connectors/mongodb-connector';
import { createPedestrianMongoRepository } from '@clean-stack/domain_pedestrian_data';
import { ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/framework/utilities';
import { Connection } from 'mongoose';
import { config } from './config';

const handleError: ServiceControllerErrorHandler = error => {
  mainLogger.error(error);
  const metadata = new Metadata();
  const formattedError = errorHandler(error, (error: unknown) => {
    mainLogger.error(error);
  });

  metadata.set('error-code', formattedError.errorCode);
  metadata.set('error-message', formattedError.message.toString());

  return metadata;
};
const mongoDBConnector = createMongoDBConnector(mainLogger, {
  uri: config.mongoConnectionUri,
  name: 'mongodb',
});
async function main() {
  exceptions(mainLogger);

  const { name: mongoDBName, healthCheck: mongoDBHealthCheck } = await mongoDBConnector.connect();
  const connection: Connection = getMongoDBConnection();
  const llm = new AzureChatOpenAI({
    ...config.azureOpenAi,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
  });

  const server = new Server();

  const address = config.address;
  try {
    const pedestrianRepository = createPedestrianMongoRepository(connection);
    const llmService = llmServiceServer(pedestrianRepository, llm, handleError, mainLogger);

    server.addService(ServiceLLMService, llmService);
  } catch (error) {
    mainLogger.error(`Failed to add service: ${error}`);
  }

  server.bindAsync(address, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      mainLogger.error(`Failed to bind server to ${address}: ${err}`);
      process.exit(1);
    }
    mainLogger.info(`Service name: ${address}`);
  });

  const onShutdown = async () => {
    mainLogger.info('Shutting down server');
    server.forceShutdown();
    telemetrySdk.shutdown();
    await mongoDBConnector.disconnect();
  };

  gracefulShutdown(mainLogger, onShutdown);
  // console.log(mongooseSchemaToText(pedestrianSchema));

  // const fileData = loadDataFromFIle() as any;
  // const pedestrianModel = getPedestrianModel(connection);
  // mainLogger.info('Pedestrian model created');
  // const aggr = await pedestrianModel.aggregate([
  //   {
  //     $match: {
  //       'properties.location_name': 'Schönbornstraße',
  //       'properties.timestamp': {
  //         $gte: 1736160000,
  //         $lt: 1736246400,
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       temperature: '$properties.temperature',
  //       pedestrians_count: '$properties.pedestrians_count',
  //     },
  //   },
  // ]);
  // mainLogger.info({ found: true, aggr }, 'Aggregation result');

  // mainLogger.info(fileData.features.length);

  // fileData.features.forEach(async (feature: any) => {
  //   try {
  //     const pedestrian = new pedestrianModel({
  //       geometry: {
  //         type: feature.geometry.type,
  //         coordinates: feature.geometry.coordinates,
  //       },
  //       properties: {
  //         ...feature.properties,
  //         details_zones: JSON.parse(feature.properties.details_zones),
  //       },
  //     });
  //     await pedestrian.save();
  //     mainLogger.info('Pedestrian data saved');
  //   } catch (error) {
  //     mainLogger.error(feature, error.message, 'Failed to save pedestrian data ');
  //     exit(1);
  //   }
  // });
}

main().catch(error => {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
});
