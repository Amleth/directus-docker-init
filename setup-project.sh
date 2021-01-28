# SET session_replication_role = 'replica';
# SET session_replication_role = 'origin';

mkdir pg-$1
cp ./directus-project-base/Dockerfile.pg pg-$1/Dockerfile
cp ./directus-project-base/directus-9.0.0-rc.31-initdb.sql pg-$1/init.sql

mkdir $1
cp -r ./directus-project-base/directus-9.0.0-rc.31-init/ $1
cp ./directus-project-base/Dockerfile.directus $1/Dockerfile
cp ./directus-project-base/.dockerignore $1
cp ./directus-project-base/directus-9.0.0-rc.31-app.js ./$1/patched-app.js
sed -i '' 's/^PUBLIC_URL="\/"/PUBLIC_URL="\/'$1'"/g' ./$1/.env
sed -i '' 's/^DB_HOST="127.0.0.1"/DB_HOST="pg-'$1'"/g' ./$1/.env