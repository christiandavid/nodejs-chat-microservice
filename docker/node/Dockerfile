FROM node:13

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash - &&\
    apt-get update &&\
    apt-get install -y npm &&\
    npm install -g n

ARG NODE_ENV=production
ARG NODE_VERSION=latest
ARG PROJECT_PATH=/opt/app/

ENV PROJECT_PATH=$PROJECT_PATH
ENV NODE_ENV=$NODE_ENV

# Add
RUN groupadd -r www-app &&\
    useradd -r -g www-app www-app

RUN mkdir -p /home/www-app &&\
    chmod 777 /home/www-app -R

COPY scripts/entrypoint.sh /usr/bin/entrypoint

RUN chmod 700 /usr/bin/entrypoint

WORKDIR /opt/app
