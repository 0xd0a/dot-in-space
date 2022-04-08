#!/bin/bash

docker stop api-server
docker rm api-server
docker run --name api-server -d -p 5000:5000 --network bridge api-server