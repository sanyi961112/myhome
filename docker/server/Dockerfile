FROM node:13.8.0 AS myhome-build
WORKDIR /usr/src/app
COPY ./frontend .
RUN npm install && npm run build

FROM node:13.8.0 AS myhome-server
WORKDIR /usr/src/app
#WORKDIR /root/
COPY  ./server .
COPY --from=myhome-build /usr/src/app/dist/myhome ./dist/myhome
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
