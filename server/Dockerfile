
# Dpendencies 설치 환경 (deps)
FROM node:18.12.1-alpine AS deps

WORKDIR /usr/src/308_poten_day/app

# COPY ./package*.json yarn.lock nest-cli.json tsconfig.json ./
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases
COPY nest-cli.json tsconfig.json ./


COPY . .

RUN npm install -g @nestjs/cli
RUN yarn 
RUN yarn build

# COPY . .



# 서버 실행 (runner) - node_modules, dist 파일만 복사 >> 빌드 과정 후 필요한 파일만 복사하여 컨테이너 실행
FROM node:18.12.1-alpine AS runner


WORKDIR /usr/src/308_poten_day/app

# COPY --from=deps /usr/src/308_poten_day/app/dist ./dist
# COPY --from=deps /usr/src/308_poten_day/app/envs ./envs
# COPY --from=deps /usr/src/308_poten_day/app/node_modules ./node_modules
COPY --from=deps /usr/src/308_poten_day/app/dist ./dist
COPY --from=deps /usr/src/308_poten_day/app/envs ./envs
COPY --from=deps /usr/src/308_poten_day/app/.yarn ./.yarn
COPY --from=deps /usr/src/308_poten_day/app/.pnp.cjs ./.pnp.cjs
COPY --from=deps /usr/src/308_poten_day/app/package.json ./package.json
COPY --from=deps /usr/src/308_poten_day/app/yarn.lock ./yarn.lock


CMD ["node", "dist/main"]


