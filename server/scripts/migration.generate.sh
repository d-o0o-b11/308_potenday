export NODE_ENV=$1

GeneratedMigrationFilePath=$2

typeorm_bin=$(yarn bin typeorm)

yarn env-cmd -f ./envs/$1.env \
  ts-node -r tsconfig-paths/register $typeorm_bin \
  -d=./src/database/config/typeorm.config.ts \
  migration:generate \
  ./src/database/migrations/${GeneratedMigrationFilePath}