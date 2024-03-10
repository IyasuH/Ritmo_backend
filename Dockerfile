# use the offical Node.js 20 image as the base image
FROM node:20-alpine

# set working directory inside the container
WORKDIR /usr/src/app

# copy package.json and package-lock.json to working dir
COPY package*.json ./

# install dependencies
RUN npm install

# copy othe application files to the working dir
COPY --chown=node:node . .

# chnage the user as non privileged user
USER node

# select and expose port on which application listsens
EXPOSE 7000

# start the application
CMD [ "node", "index.js" ]