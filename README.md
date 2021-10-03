# Express.js Typescript Boilerplate

## Description

A boilerplate project for working with express.js and typescript in an OOP manner.
Inspired by [mwanago's express-typescript](https://github.com/mwanago/express-typescript/).

## Setup

Create a `.env.local` for local development (outisde docker) from the `.env.local.example` file.

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

Create a `.env` for production from the `.env.example` file.

```bash
$ # start up the containers
$ yarn docker:compose
$ # run the migrations
$ yarn docker:migration:up
```