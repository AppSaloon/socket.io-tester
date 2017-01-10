#!/bin/bash

export NODE_ENV=production

rm -R app
mkdir app
mkdir app/css
touch app/css/style.css
mkdir app/js
touch app/js/app.js

cp src/html/index.html app/index.html

cp -r src/images app/images

cp src/js/electronApp.js app/electron.js

echo "starting browserify"
node_modules/.bin/browserify -e src/js/index.js -o "app/js/app.js" -t [ babelify ]
echo "starting node-sass"
node_modules/.bin/node-sass src/css -o app/css
echo "starting uglifyjs"
node_modules/.bin/uglifyjs -m -c -o app/js/app.js app/js/app.js
