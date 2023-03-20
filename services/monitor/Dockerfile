FROM node:8.9.3-alpine

WORKDIR /app

EXPOSE 80 


RUN apk add git --update --no-cache 


RUN npm install -g nodemon 

COPY package.json . 

RUN npm install && npm cache clean --force 

COPY . . 
ENTRYPOINT [ "nodemon" ,"." ]
