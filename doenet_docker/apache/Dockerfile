FROM node:19.8-bullseye AS build
WORKDIR /build
COPY src ./src
COPY public ./public
COPY index.html package*.json vite.config.js ./
RUN echo "$(ls)"
RUN npm ci
RUN npx vite build --outDir site

FROM httpd:2.4.41-alpine
RUN apk update; \
    apk upgrade;
WORKDIR /usr/local/apache2
COPY --from=build /build/site ./htdocs
COPY ./doenet_docker/apache/apache.conf ./conf/httpd.conf
EXPOSE 80
EXPOSE 443
