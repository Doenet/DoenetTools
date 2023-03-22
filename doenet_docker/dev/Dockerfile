FROM node:19.8-bullseye
RUN apt-get update && \
    apt-get -y install \
    # for docker from source
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    # for git from source
    make \
    libssl-dev \
    libghc-zlib-dev \
    libcurl4-gnutls-dev \
    libexpat1-dev \
    gettext \
    unzip \
    install-info \
    asciidoc \
    xmlto \
    docbook2x

RUN wget https://github.com/git/git/archive/refs/tags/v2.40.0.tar.gz \
    && tar -zxf v2.40.0.tar.gz \
    && cd git-2.40.0

RUN make configure
RUN ./configure --prefix=/usr
RUN make NO_GETTEXT=YesPlease all doc info
RUN make install install-doc install-html install-info 
RUN cd ..

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
COPY --chown=node:node package*.json vite.config.js ./
USER node

CMD ["npm", "run", "dev"]