/* SocketsList */
'use strict';
var SocketDiv = require('./socketDiv.js');

module.exports = React.createClass({
    displayName: 'exports',

    relayRemoveSocket: function relayRemoveSocket(socket) {
        this.props.onRemoveSocket(socket);
    },
    render: function render() {
        var _this = this;

        // console.log('render SocketList');
        var socketNodes = this.props.connectedSockets.map(function (socket) {
            var key = socket.id || new Date().valueOf() + Math.round(Math.random() * 99999);
            return React.createElement(
                SocketDiv,
                { key: key, socket: socket, onRemoveSocket: _this.relayRemoveSocket },
                socket.io.uri
            );
        });
        return React.createElement(
            'div',
            { className: 'socketList' },
            socketNodes
        );
    }
});