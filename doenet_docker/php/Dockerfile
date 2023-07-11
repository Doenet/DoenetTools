FROM composer as composer
WORKDIR /build
COPY ./doenet_docker/php/composer.json .
RUN composer install --ignore-platform-reqs

FROM php:7.4-fpm
RUN  apt-get update -y && \
     apt-get dist-upgrade -y
RUN apt-get install -y p7zip \
    p7zip-full \
    unace \
    zip \
    unzip \
    xz-utils \
    sharutils \
    uudeview \
    mpack \
    arj \
    cabextract \
    file-roller
RUN rm -rf /var/lib/apt/lists/* &&\
    apt-get -y autoremove && \
    apt-get clean
RUN docker-php-ext-install mysqli

WORKDIR /usr/local/apache2/htdocs/api/
COPY ./public/api .
COPY --from=composer /build/vendor ./vendor
EXPOSE 9000