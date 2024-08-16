
export NODE_ENV=$1

yarn env-cmd -f ./envs/$1.env \
    ts-node -r tsconfig-paths/register ./node_modules/typeorm-extension/bin/cli.cjs \
    -d=./src/database/config/read-typeorm.config.ts \
    seed:run


