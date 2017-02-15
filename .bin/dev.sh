#!/bin/bash

export NODE_ENV=develop

rm -R build
mkdir build
mkdir build/css
touch build/css/style.css
mkdir build/js
touch build/js/app.js

cp src/app/html/index.html build/index.html

cp -r src/app/images build/images

echo "starting watchify"
node_modules/.bin/watchify -e src/app/js/index.js -o "build/js/app.js" -d -v -t [ babelify ] &

cp node_modules/codemirror/lib/codemirror.css src/app/css/_codemirror.css
echo "starting node-sass"
node_modules/.bin/node-sass --source-map true src/app/css -o build/css
node_modules/.bin/node-sass --source-map true -w src/app/css -o build/css &
rm src/app/css/_codemirror.css

echo "starting browser-sync"
node_modules/.bin/browser-sync start --files "build/css/*.css, build/js/*.js" --server build
