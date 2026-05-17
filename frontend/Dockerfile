FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/frontend/ ./dist/frontend/
COPY --from=build /app/package.json ./

RUN npm install --omit=dev --ignore-scripts

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "dist/frontend/server/server.mjs"]
