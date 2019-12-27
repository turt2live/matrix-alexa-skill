FROM node:alpine
COPY . /tmp/src
RUN cd /tmp/src \
    && yarn install \
    && yarn build \
    && mv lib/ /alexa/ \
    && mv node_modules / \
    && cd / \
    && rm -rf /tmp/*

ENV NODE_ENV=production
ENV NODE_CONFIG_DIR=/data/config

WORKDIR /alexa
CMD node index.js
VOLUME ["/data"]
