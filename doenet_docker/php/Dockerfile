# composer:2.2.18
# https://hub.docker.com/layers/library/composer/2.2.18/images/sha256-7b05f8df23459b8631d50c6720025e7f44ab5072c18ec727f64c100ebd03ead4?context=explore
FROM composer@sha256:7b05f8df23459b8631d50c6720025e7f44ab5072c18ec727f64c100ebd03ead4 as composer
WORKDIR /build
COPY ./doenet_docker/php/composer.json .
RUN composer install --ignore-platform-reqs

FROM php:5.4-fpm
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
COPY ./src/Api .
COPY --from=composer /build/vendor ./vendor
EXPOSE 9000
