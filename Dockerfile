FROM node:14-slim

# Create app directory
WORKDIR /usr/src/app

USER root

RUN apt-get update
RUN apt-get -qq install graphicsmagick texlive git -y

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY dist/package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY dist/ .

USER node

EXPOSE 3000
CMD [ "node", "src/index.js" ]
