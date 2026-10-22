
FROM node:22-alpine

WORKDIR /app

COPY ca.pem ./ca.pem
ENV NODE_EXTRA_CA_CERTS=/app/ca.pem

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]