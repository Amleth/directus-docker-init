Dumper une base PostgresSQL :

    docker exec $(docker ps --no-trunc -aqf name=pg_1) /usr/bin/pg_dump -U admin directus