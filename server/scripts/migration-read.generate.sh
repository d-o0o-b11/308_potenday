export NODE_ENV=$1

GeneratedMigrationFilePath=$2

yarn env-cmd -f ./envs/$1.env \
    ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
    -d=./src/database/config/read-typeorm.config.ts \
    migration:generate \
    ./src/database/migrations/read/${GeneratedMigrationFilePath}


