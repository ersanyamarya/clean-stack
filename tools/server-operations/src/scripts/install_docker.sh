#!/bin/bash

# This script installs Docker and Docker Compose on a Linux system.
# It checks if Docker is already installed, and if not, it installs it.
# It also installs Docker Compose if it is not already installed.

sudo apt update
# Run the following command to uninstall all conflicting packages:
echo "Uninstalling conflicting packages..."
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt remove -y $pkg
done

# Add Docker's official GPG key:
echo "Adding Docker's official GPG key..."

sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo "Adding Docker repository to Apt sources..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update

# Install Docker:
echo "Installing Docker and related packages..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin &&
  sudo systemctl start docker &&
  sudo systemctl enable docker

# Check if Docker is installed:
if ! command -v docker &>/dev/null; then
  echo "Docker installation failed."
  exit 1
fi
echo "Docker installed successfully."
# Check if Docker Compose is installed:
if ! command -v docker-compose &>/dev/null; then
  echo "Docker Compose installation failed."
  exit 1
fi
echo "Docker Compose installed successfully."
# Add the current user to the Docker group:
echo "Adding current user to the Docker group..."
sudo usermod -aG docker $USER
echo "Please log out and log back in to apply the group changes."

echo "Docker and Docker Compose installation completed successfully."
echo "You can now use Docker and Docker Compose without sudo."
