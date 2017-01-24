bash .bin/build.sh

cp build_package.json app/package.json
cd app
yarn
cd ..
node_modules/.bin/asar p app app.asar