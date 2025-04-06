FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm init -y && \
    npm install express express-session body-parser

EXPOSE 3002

CMD ["node", "public-js-server.cjs"]
