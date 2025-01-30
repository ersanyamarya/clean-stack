import { useBash } from 'zx';
import { transferToServer } from './operations/transfer.operations.mjs';

useBash();

const server = {
  username: 'azureuser',
  hostname: '20.86.27.245',
  publicKeyPath: '~/.ssh/the-one.pem',
};

const commands = {
  installDocker: 'curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh',
  addUserToDockerGroup: username => `sudo usermod -aG docker ${username}`,
  updatePackagesOnUbuntu:
    'sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y',
  installLazyDocker: 'curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash',
  addLsAliases: `echo 'alias ls="ls --color=auto"' >> ~/.bashrc && echo 'alias ll="ls -alF"' >> ~/.bashrc && echo 'alias la="ls -A"' >> ~/.bashrc && echo 'alias l="ls -CF"' >> ~/.bashrc && source ~/.bashrc`,
};

await transferToServer(server, 'node_modules', '/home/azureuser/smart-city');
