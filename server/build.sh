#!/bin/sh

npm run clean
npm run build:prisma
npm run build:graphql
npm run build:graphql:dist
npm run build
