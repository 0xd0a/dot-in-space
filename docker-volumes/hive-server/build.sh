#!/bin/bash
#docker build --network host -t hive-server .
#cd ..
#docker-compose restart hive-server

sudo docker run hive-server "/code/build.sh"

# and restart hive-server
