#!/bin/bash

ENV_PATH='.env'

# extract envs between # - TEST SERVICE - and # - END TEST SERVICE -
echo "Extracting envs from $ENV_PATH"

# Array of services to extract
services=("USER SERVICE")

# Read the contents of the file
contents=$(<"$ENV_PATH")

add_separator() {
  file="$1"
  echo "" >>"$file"
  echo "# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" >>"$file"
  echo "" >>"$file"
}

extract_envs() {
  local service="$1"
  local start_marker="# - $service -"
  local end_marker="# - END $service -"
  echo "$contents" | sed -n "/$start_marker/,/$end_marker/p"
}

# Extract the global envs between GLOBAL VARIABLES and END GLOBAL VARIABLES
global_envs=$(echo "$contents" | sed -n '/GLOBAL VARIABLES/,/END GLOBAL VARIABLES/p')

echo "Extracted global envs"
echo "$global_envs"

# Extract the desired section for each service
for service in "${services[@]}"; do
  # Write the global envs to the service env file
  echo "$global_envs" >.env."$service"

  add_separator ".env.$service"

  # Append the extracted envs to the service env file
  extracted_envs=$(extract_envs "$service")
  echo "$extracted_envs" >>.env."$service"

  add_separator ".env.$service"
done
