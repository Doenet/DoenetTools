FROM composer:2.2 as composer
WORKDIR /build
COPY ./doenet_docker/php/composer.json .
RUN composer install --ignore-platform-reqs

FROM php:5.4-fpm
RUN docker-php-ext-install mysqli

WORKDIR /usr/local/apache2/htdocs/api/
COPY ./src/Api .
COPY --from=composer /build/vendor ./vendor
EXPOSE 9000