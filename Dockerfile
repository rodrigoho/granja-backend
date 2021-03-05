FROM node:12

WORKDIR /opt/granja

COPY . .

RUN yarn install

CMD ["yarn", "dev"]
