FROM node:19.7
RUN apt-get update && \
    apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && \
    apt-get -y install docker-ce docker-ce-cli containerd.io

RUN rm -rf /var/lib/apt/lists/* &&\
    apt-get -y autoremove && \
    apt-get clean

RUN mkdir -p /home/node/workspace/node_modules && chown -R node:node /home/node/workspace
WORKDIR /home/node/workspace
COPY --chown=node:node package*.json snowpack.config.js ./
USER node

CMD ["npm", "run", "start:dev"]