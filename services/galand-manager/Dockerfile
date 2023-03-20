FROM node:12-alpine

ARG  PROJECT

WORKDIR /app

RUN apk add git --update --no-cache 

# required for bcrypt 
RUN apk add python make g++  --update  --no-cache

RUN npm install -g nodemon 

## will install dependencies as local packages
RUN npm install -g install-local

COPY services/${PROJECT}/package.json . 

RUN npm install && npm cache clean --force 

COPY packages/js/ packages/

RUN install-local --save

COPY services/${PROJECT} . 



ENTRYPOINT [ "node" ,"." ]
