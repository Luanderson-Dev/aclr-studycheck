FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm install; fi

COPY tsconfig.json ./
COPY src ./src

RUN npx tsc

FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production && yarn cache clean; else npm install --omit=dev; fi

COPY --from=builder /app/build ./build

CMD ["node", "build/main.js"]
