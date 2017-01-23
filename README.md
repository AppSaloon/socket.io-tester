# chrome-app_socket.io-tester
A chrome app that lets you connect to a socket.io server and subscribe to a 
certain topic and/or lets you send socket messages to the server

---

##### Install node modules
`$ yarn install`

##### Build for development
`$ yarn run dev`

##### build app for electron
* build
`$ yarn run build`
* and run electron
`$ node_modules/.bin/electron .`

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





