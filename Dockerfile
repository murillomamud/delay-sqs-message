#create a docker to run the app using the image of node
FROM node:18-alpine3.17

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

#copy the package.json file to the working directory
COPY ./package.json ./
COPY ./package-lock.json ./

#install the dependencies
RUN npm ci

#copy the rest of the files to the working directory
COPY ./src ./src
COPY ./index.js ./index.js


HEALTHCHECK --interval=90s --timeout=30s --start-period=5s --retries=3 CMD [ "node -v" ]

#run the app
CMD ["node", "index.js"]