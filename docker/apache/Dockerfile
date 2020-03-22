FROM httpd:2.4.41-alpine
RUN apk update; \
    apk upgrade;
COPY ./apache.conf /usr/local/apache2/conf/httpd.conf
EXPOSE 80
EXPOSE 443
