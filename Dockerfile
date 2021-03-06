#FROM node:12-alpine

FROM reactioncommerce/node-dev:12.14.1-v1
RUN  apk --update add autoconf automake build-base libtool nasm zlib-dev

ARG NEXTJS_DOTENV

ENV NEXTJS_DOTENV=$NEXTJS_DOTENV

## hadolint ignore=DL3018
RUN apk --no-cache add bash curl less tini vim make
SHELL ["/bin/bash", "-o", "pipefail", "-o", "errexit", "-u", "-c"]
#
WORKDIR /usr/local/src/app
ENV PATH=$PATH:/usr/local/src/app/node_modules/.bin
##
### Allow yarn/npm to create ./node_modules
RUN chown node:node .
#
### Copy specific things so that we can keep the image as small as possible
### without relying on each repo to include a .dockerignore file.
COPY --chown=node:node ./ ./
##
#USER node
#
## Install ALL dependencies. We need devDependencies for the build command.
#RUN yarn install --production=false --ignore-scripts --non-interactive --no-cache
#
#ENV BUILD_ENV=production NODE_ENV=production
#
## hadolint ig    nore=SC2046
#RUN yarn build
#
## Install only prod dependencies now that we've built, to make the image smaller
##RUN rm -rf node_modules/*
##RUN yarn install --production=true --ignore-scripts --non-interactive
#
## If any Node flags are needed, they can be set in the NODE_OPTIONS env variable.
CMD ["./bin/start"]
#LABEL com.reactioncommerce.name="example-storefront"
