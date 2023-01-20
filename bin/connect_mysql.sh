#!/bin/bash

# # chmod +x bin/connect_mysql.sh (実行権限の付与)
docker compose exec db mysql --user=reversi --password=password reversi
