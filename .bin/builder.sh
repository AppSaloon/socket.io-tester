#!/bin/bash

export NODE_ENV=production

rm -rf dist

bash .bin/builder-js.sh

cp -r src/electron/* app

echo "starting electron-packager"
node_modules/.bin/electron-builder -mlw

echo "done"