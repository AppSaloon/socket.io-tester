bash .bin/build.sh

echo "copying package.json"
cp build_package.json app/package.json
cd app
echo "installing dependencies"
yarn
cd ..
echo "packaging asar"
node_modules/.bin/asar p app app.asar
echo "done"