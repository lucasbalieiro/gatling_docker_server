FROM node:20

WORKDIR /app

COPY package*.json /app/
RUN npm install
 
COPY src/example.gatling.js /app/src/example.gatling.js
COPY server.js /app

RUN npx gatling run --simulation example 


EXPOSE 9091

CMD ["npm", "start"]
