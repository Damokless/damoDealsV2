FROM node:18.11.0-alpine
WORKDIR .

COPY . .

RUN yarn install

CMD ["yarn", "start"]