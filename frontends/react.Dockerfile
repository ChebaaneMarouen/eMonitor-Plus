# DEV Stage
FROM node:12-alpine AS development

RUN npm install -g nodemon 

## will install dependencies as local packages

ARG PROJECT

WORKDIR /app

EXPOSE 3000

RUN apk add --update --no-cache git

COPY $PROJECT/package*.json ./ 

RUN npm install  

# temp bug fix 
# waiting for https://github.com/facebook/create-react-app/pull/8079 to be merged
RUN sed -i "s/protocol: 'ws',/protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',/g" node_modules/react-dev-utils/webpackHotDevClient.js

COPY $PROJECT/ .

COPY shared/ src/@shared/

ENTRYPOINT  npm start

# BUILD Stage
FROM development AS builder
RUN npm run-script build
RUN ls /app/build

# PRODUCTION Stage
FROM nginx:alpine AS production

RUN  rm -rf /etc/nginx/conf.d

COPY nginx-config/server.conf  /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

