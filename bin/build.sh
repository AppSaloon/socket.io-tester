#!/bin/bash

rm -R build_app
mkdir build_app
touch build_app/style.css
touch build_app/app.js

cp -r src/fonts build_app/

cp -r appFiles/ build_app/

echo "build js"
node_modules/.bin/browserify -e src/js/app.js -o build_app/app.js -d -v -t [ babelify --presets [ es2015 react ] ]
# node_modules/.bin/browserify -e src/js/app.js build_app/app.js -t [ babelify --presets [ es2015 react ] ]
echo "build css"
node_modules/.bin/node-sass --source-map true src/sass -o build_app/