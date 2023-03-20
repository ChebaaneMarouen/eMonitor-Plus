FROM node:lts-alpine

ARG  PROJECT

WORKDIR /app

RUN apk add git --update --no-cache 

# required for bcrypt 
RUN apk add python3 make g++  --update  --no-cache

RUN npm install -g nodemon 

## will install dependencies as local packages
RUN npm install -g install-local

COPY ${PROJECT}/package.json . 

RUN npm install && npm cache clean --force 

COPY packages/ packages/

RUN install-local

COPY ${PROJECT} . 

ENTRYPOINT [ "node" ,"." ]
