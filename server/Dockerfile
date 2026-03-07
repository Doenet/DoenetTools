# Dockerfile for the `server` of the Doenet web app.
# 
# NOTE: 
# 
# This Dockerfile assumes that the `dist` directory has already
# been built and contains the necessary files for the server to run.
# This only works if `dist` was built on a compatible system.
#
# Right now, this is fine since we're only planning to use the Dockerfile
# to deploy to AWS, which means the build is done in a reproducible
# environment (Github Actions).
#
# If you want to use Docker in development, you will most likely need
# to modify this Dockerfile or create another Dockerfile.

WORKDIR /DoenetTools/server

COPY dist ./dist
COPY entrypoint.sh ./

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3000

RUN useradd serveruser
USER serveruser