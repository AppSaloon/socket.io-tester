# chrome-app_socket.io-tester
A chrome app that lets you connect to a socket.io server and subscribe to a 
certain topic and/or lets you send socket messages to the server

---

##### Install node modules
`$ npm install`

##### Build for development
`$ npm run dev`

##### build app for chrome
`$ npm run build`

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







socket.io.js had to be modified to run inside app
