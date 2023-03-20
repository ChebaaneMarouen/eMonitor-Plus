FROM apify/actor-node-chrome

ARG  PROJECT

USER root

WORKDIR /app

RUN apt-get update

RUN apt-get install libxtst6

RUN npm install -g nodemon 

## will install dependencies as local packages
RUN npm install -g install-local

COPY ${PROJECT}/package.json . 
COPY ${PROJECT}/package-lock.json . 


RUN npm install && npm cache clean --force 

COPY packages/ packages/

RUN install-local

COPY ${PROJECT} . 

ENTRYPOINT [ "node" ,"." ]