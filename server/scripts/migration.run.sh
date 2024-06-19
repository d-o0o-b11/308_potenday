export NODE_ENV=$1

yarn env-cmd -f ./envs/$1.env \
    ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
    -d=./src/database/config/typeorm.config.ts \
    migration:run

