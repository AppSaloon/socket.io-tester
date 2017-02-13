export NODE_ENV=production
echo "starting build"
node_modules/.bin/electron-packager app --platform=darwin,linux,win32 --arch=all --asar --icon ./icon.jpg --out packages --electron-version v1.6.0