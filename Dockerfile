FROM node:16-alpine as build
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
RUN ls -a

## this is stage two, where the app actually runs
FROM node:16-alpine
WORKDIR /usr
ENV NODE_ENV=production
COPY package.json ./
COPY yarn.lock ./
RUN yarn --prod
COPY --from=build /usr/dist ./dist/
EXPOSE 5000
CMD [ "yarn", "start:prod"]