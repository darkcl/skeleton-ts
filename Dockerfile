FROM node:8

WORKDIR /server

COPY . /server
RUN npm install && npm run postinstall && ls ./dist

EXPOSE 3000

CMD ["npm", "start"]
