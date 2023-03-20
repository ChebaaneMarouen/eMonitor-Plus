FROM nginx:1.15-alpine 

ARG PROJECT

RUN apk add --update -q apache2-utils

COPY docker-entry.sh .

RUN chmod +x docker-entry.sh 

RUN mkdir -p  nginx_configs/conf

# if use https then load a different config file  
COPY *.conf nginx_configs/   

COPY configurations/$PROJECT/* nginx_configs/configurations/

ENTRYPOINT ["./docker-entry.sh"]
CMD ["nginx", "-g", "daemon off;"]
