FROM node:14.17.0-alpine

ARG env

RUN apk add --no-cach nano && apk add --no-cach vim 

RUN apk add --no-cach npm && npm set progress=false && npm install gulp-imagemin && apk add --no-cache make git 

RUN apk update && apk upgrade

COPY ./docker/entrypoint.sh /

RUN chmod +x /entrypoint.sh && mkdir /app

WORKDIR /app

COPY .  /app

RUN cd /app && \
        npm set progress=false && \
        npm install && \
        npm install pm2 -g
 

CMD pm2-runtime index.js
