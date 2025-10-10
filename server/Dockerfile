FROM node:lts-trixie
WORKDIR /DoenetTools/server

COPY . .

EXPOSE 3000

RUN useradd serveruser
USER serveruser