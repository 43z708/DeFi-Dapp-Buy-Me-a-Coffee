FROM node:16.13.1

RUN apt-get update && \
  apt-get install -y yarn &&\ mkdir /mnt

WORKDIR /mnt

