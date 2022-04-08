#!/bin/bash

docker stop app-server
docker rm app-server
docker run --name app-server -d -p 8000:8000 --network bridge app-server