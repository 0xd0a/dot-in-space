#!/bin/bash
docker build --network host -t api-server .
cd ../..
docker-compose restart api-server