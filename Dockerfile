FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY fixtures ./fixtures

RUN npm run build

CMD ["node", "dist/cli.js", "validate", "fixtures/definitions/grid-connection-request.json"]

