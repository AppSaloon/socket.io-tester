export NODE_ENV=production
bash .bin/build.sh
echo "copying package.json"
cp build_package.json app/package.json
cd app
echo "installing dependencies"
yarn add babel-plugin-transform-regenerator@6.22.0
cd ..
echo "starting electron-packager"
node_modules/.bin/electron-packager app --platform=darwin,linux,win32 --arch=all --asar --icon assets/logo --out packages
echo "packaging asar"
node_modules/.bin/asar p app app.asar
echo "copying asar into app buils"
cp app.asar packages/socket-io-tester-darwin-x64/socket-io-tester.app/Contents/Resources/app.asar
cp app.asar packages/socket-io-tester-linux-armv7l/resources/app.asar
cp app.asar packages/socket-io-tester-linux-ia32/resources/app.asar
cp app.asar packages/socket-io-tester-linux-x64/resources/app.asar
cp app.asar packages/socket-io-tester-win32-ia32/resources/app.asar
cp app.asar packages/socket-io-tester-win32-x64/resources/app.asar
rm app.asar

echo "done"