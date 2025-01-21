import { useBash } from 'zx';
import { transferToServer } from './transfer.operations.mjs';

useBash();

const server = {
  username: 'azureuser',
  hostname: '20.86.27.245',
  publicKeyPath: '~/.ssh/the-one.pem',
};

await transferToServer(server, 'node_modules', '/home/azureuser/smart-city');
