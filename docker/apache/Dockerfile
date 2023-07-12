FROM node:19.8-bullseye AS build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public
ARG BUILD_MODE=production
ARG NODE_OPTIONS
ENV NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=3584}
RUN npm run build -- --outDir site --mode ${BUILD_MODE}

FROM httpd:2.4.41-alpine
RUN apk update; \
    apk upgrade;
WORKDIR /usr/local/apache2
COPY ./docker/apache/apache.conf ./conf/httpd.conf
COPY --from=build /build/site ./htdocs
EXPOSE 80
EXPOSE 443