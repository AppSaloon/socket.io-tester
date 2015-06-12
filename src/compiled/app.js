// jQuery = require("../../bower_components/jquery/dist/jquery.min.js");
// require("../../bower_components/react/react.min.js");
// require("../../appFiles/socket.io.js");
// require("../../bower_components/bootstrap/dist/js/bootstrap.min.js");

'use strict';

var Container = require('./container.js');

/* Init */
React.render(React.createElement(Container, null), document.getElementById('content'));