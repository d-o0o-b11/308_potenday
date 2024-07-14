export NODE_ENV=$1

typeorm_bin=$(yarn bin typeorm)

yarn env-cmd -f ./envs/$1.env \
  ts-node -r tsconfig-paths/register $typeorm_bin \
  -d=./src/database/config/typeorm.config.ts \
  migration:run 


