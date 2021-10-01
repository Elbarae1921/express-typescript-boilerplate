# Express.js Typescript Boilerplate

## Description

A boilerplate project for working with express.js and typescript in an OOP manner.
Inspired by [mwanago's express-typescript](https://github.com/mwanago/express-typescript/).

## Setup

Create a `.env` (for running the app outside of docker- development) and `.env.prod` (for running the app inside docker- production) file from the `.env.example` and `.env.prod.example` respectively, and assign the variables their corresponding values.

## Development
```bash
$ # start up the db
$ yarn docker:db
$ # install dependencies
$ yarn
$ # run the migrations
$ yarn migration:up
$ # optionally seed the database
$ yarn seed
$ # start the app in watch mode
$ yarn start:dev
```

### Production
```bash
$ # start up the containers
$ yarn docker:compose
$ # run the migrations
$ yarn docker:migration:up
```