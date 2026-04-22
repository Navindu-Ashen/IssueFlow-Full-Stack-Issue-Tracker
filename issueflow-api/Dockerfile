FROM node:20-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN if [ ! -f package-lock.json ]; then npm install --package-lock-only; fi \
  && npm ci --omit=dev

COPY src ./src

EXPOSE 3001

CMD ["node", "src/app.js"]
