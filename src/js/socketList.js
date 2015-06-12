/* SocketsList */
'use strict';
var SocketDiv = require('./socketDiv.js');

module.exports = React.createClass({
    relayRemoveSocket (socket) {
        this.props.onRemoveSocket(socket);
    },
    render () {
        // console.log('render SocketList');
        let socketNodes = this.props.connectedSockets.map(socket => {
            let key = socket.id || new Date().valueOf() + (Math.round(Math.random()*99999));
            return (
                <SocketDiv key={key} socket={socket} onRemoveSocket={this.relayRemoveSocket}>
                    {socket.io.uri}
                </SocketDiv>
            );
        });
        return (
            <div className="socketList">
                {socketNodes}
            </div>
        );
    }
});
