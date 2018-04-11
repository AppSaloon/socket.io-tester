# ![socket.io tester](https://github.com/AppSaloon/socket.io-tester/raw/master/assets/icon.png) Socket.io tester 

[![GitHub version](https://badge.fury.io/gh/appsaloon%2Fsocket.io-tester.svg)](https://badge.fury.io/gh/appsaloon%2Fsocket.io-tester) [![Dependency Status](https://www.versioneye.com/user/projects/588f5a2f5715cf0034134062/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/588f5a2f5715cf0034134062) [![Code Climate](https://codeclimate.com/github/AppSaloon/socket.io-tester/badges/gpa.svg)](https://codeclimate.com/github/AppSaloon/socket.io-tester) [![Issue Count](https://codeclimate.com/github/AppSaloon/socket.io-tester/badges/issue_count.svg)](https://codeclimate.com/github/AppSaloon/socket.io-tester)

Socket.io tester lets you connect to a socket.io server and subscribe to a 
certain topic and/or lets you send socket messages to the server
![screenshot socket.io tester app](https://github.com/AppSaloon/socket.io-tester/raw/master/assets/screenshotV110.png) 

---

##### Install node modules
`$ yarn install`

##### Build and open in browser
`$ yarn run dev`

##### Build and open as electron app
* build
`$ yarn run build`
* and run electron
`$ node_modules/.bin/electron .`

##### build asar file
`$ yarn run electron-build`

##### package all application versions for distribution (win, linux, macos)
`$ yarn run package`

---





## socket.io test server

start test server by running `node socketTest/index.js`

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

