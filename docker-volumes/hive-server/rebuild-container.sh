#!/bin/bash

# rebuild runnning container and restart it

cd ../..
sudo docker-compose up -d --no-deps --build hive-server