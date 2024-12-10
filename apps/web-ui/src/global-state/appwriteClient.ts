import { Account, Client, ID } from 'appwrite';

import { appWriteConfig } from '../utils/config';

const client = new Client().setEndpoint(appWriteConfig.endpoint).setProject(appWriteConfig.projectId);

const account = new Account(client);

export { account, client, ID };
