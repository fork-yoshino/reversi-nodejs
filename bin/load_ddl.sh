#!/bin/bash

# chmod +x bin/load_ddl.sh (実行権限の付与)
cat db/init/0001_init.sql | docker compose exec -T db mysql --user=root --password=root
