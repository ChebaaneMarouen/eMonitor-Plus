#!/bin/sh

## generate kibana auth files
if [ -z "$KIBANA_USER" ] || [ -z "$KIBANA_PASSWORD" ]
then
    echo [WARNING] KIBANA Auth is not set
else
    htpasswd -bBc /etc/nginx/.htpasswd $KIBANA_USER $KIBANA_PASSWORD
fi

replace_env(){
config_file=$1
    envsubst '${DOMAIN_NAME} ${SSL_CERTIFICATE} ${SSL_PRIVATE_KEY} ${KIBANA_SECRET_TOKEN}'   <$config_file >$config_file.temp \
        && mv $config_file.temp $config_file
}

find /nginx_configs -name '*.conf' | while read config;
    do
        replace_env $config ;
    done;

# set environement variables
if [ -n "$USE_HTTPS" ]
then
    PATH_TO_CERT=/etc/nginx/certs/$SSL_CERTIFICATE
    echo $PATH_TO_CERT
    # check cert exists
    if [ ! -f $PATH_TO_CERT ]
        then
            echo [WARNING] certificate was not found
            echo [WARNING] Nginx will run without ssl for now
            cp ./nginx_configs/nginx.conf /etc/nginx/nginx.conf
            nginx ;
        fi

    while [ ! -f $PATH_TO_CERT ]
    do
        echo "[INFO] ssl server is still not ready "
        sleep 5s
    done
    # copy https nginx
    killall nginx
    cp ./nginx_configs/nginx-https.conf  /etc/nginx/nginx.conf
else
    # copy normal nginx
    cp ./nginx_configs/nginx.conf /etc/nginx/nginx.conf
fi

exec "$@"
