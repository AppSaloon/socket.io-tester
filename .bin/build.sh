#!/bin/bash

export NODE_ENV=production

rm -R app
mkdir app
mkdir app/css
touch app/css/style.css
mkdir app/js
touch app/js/app.js

cp src/app/html/index.html app/index.html

cp -r src/app/images app/images

echo "starting browserify"
node_modules/.bin/browserify -e src/app/js/index.js -o "app/js/app.js" -t [ babelify ]

cp node_modules/codemirror/lib/codemirror.css src/app/css/_codemirror.css
echo "starting node-sass"
node_modules/.bin/node-sass src/app/css -o app/css
rm src/app/css/_codemirror.css

# echo "starting uglifyjs"
# node_modules/.bin/uglifyjs -m -c -o app/js/app.js app/js/app.js

cp package.json app/
node_modules/.bin/babel -o app/index.js src/electron/index.js
node_modules/.bin/babel -o app/checkVersion.js src/electron/checkVersion.js
node_modules/.bin/babel -o app/menu.js src/electron/menu.js

echo "done"