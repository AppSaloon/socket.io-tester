// jQuery = require("../../bower_components/jquery/dist/jquery.min.js");
// require("../../bower_components/react/react.min.js");
// require("../../appFiles/socket.io.js");
// require("../../bower_components/bootstrap/dist/js/bootstrap.min.js");

var service = analytics.getService('socket.io-tester');
var tracker = service.getTracker('UA-26253416-7');
tracker.sendEvent('App starting');

var Container = require('./container.js');

/* Init */
React.render(
    <Container />,
    document.getElementById('content')
);
