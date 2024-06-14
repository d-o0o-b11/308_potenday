
docker-compose -f docker-compose.dev.yml --env-file ./server/envs/development.env up --build -d
yarn --cwd ./server start:dev