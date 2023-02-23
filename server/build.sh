#!/bin/sh

npm run clean
npm run build:prisma
npm run build:graphql
npm run build:graphql:dist
npm run build

cd ../client
npm run build
cd ../server
rm -rf public
mkdir public
cp -R ../client/build/* public/
