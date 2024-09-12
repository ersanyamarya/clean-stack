#!/bin/bash

ENV_FILE=.env
ENV_EXAMPLE_FILE=.env.example

# create .env.example file from .env file and remove values

content=$(cat $ENV_FILE)
echo "$content" | sed -E 's/=.*/=/' >$ENV_EXAMPLE_FILE

echo "Created $ENV_EXAMPLE_FILE file"
