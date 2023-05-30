FROM node:lts AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:lts
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/dist ./dist
CMD pnpm run start
