FROM node:18.11.0
WORKDIR .

COPY . .

RUN yarn install

CMD ["yarn", "start"]