FROM php:7.4-fpm-alpine
RUN apk update; \
    apk upgrade;
RUN docker-php-ext-install mysqli
EXPOSE 9000