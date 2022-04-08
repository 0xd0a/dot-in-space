#!/bin/bash

# migrate or upgrade a database

sudo docker exec -it api-server flask db init
sudo docker exec -it api-server flask db migrate -m "Automatic migration"
sudo docker exec -it api-server flask db upgrade
