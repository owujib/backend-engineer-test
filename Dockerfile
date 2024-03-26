FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]
