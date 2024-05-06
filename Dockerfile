# build stage
FROM node:16-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:16-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/.env /app/.env
COPY --from=build-stage /app/.env.production /app/.env.production
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

RUN npm install -g cross-env

EXPOSE 3000

CMD [ "cross-env", "NODE_ENV=production", "node", "/app/dist/main.js"]
