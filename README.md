# DEPRECATED  Socket.io tester 

[![GitHub version](https://badge.fury.io/gh/appsaloon%2Fsocket.io-tester.svg)](https://badge.fury.io/gh/appsaloon%2Fsocket.io-tester) 
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

[Try Firecamp](https://firecamp.io/socketio) 

---

##### Install node modules
`$ npm i`

##### Build and open in browser
`$ npm run dev`

##### Build and open as electron app
* build
`$ npm run electron-build`

##### package all application versions for distribution (win, linux, macos)
`$ npm run package-builder`

---





## socket.io test server

start test server by running `node socketTest/index.js`
or
`npm run server`

### events
* 'chat message': echoes mesages
* test: sends messages at specific interval

### namespace
* /asd
#### events in namespace
* test: sends messages at specific interval



## When updating
* change version numbers in `package.json` AND `build_package.json`
* create git tag `git tag v1.0.0`
* push changes `git push`
* and push tags `git push --tags`
* create release draft with new tag and version as release name
* Really important release NAME is the version with the v: `v1.0.0`
* Really important that `build_package.json` has the correct version without the v: `1.0.0`
* build with `package` script
* compress each build in the package dir individually and upload to github
* release

