/* Container */
'use strict';
var UrlForm = require('./urlForm.js');
var SocketList = require('./socketList.js');

module.exports = React.createClass({
    getInitialState () {
        return {connectedSockets: []};
    },
    componentWillMount () {
        if (!chrome.storage) {
            var currentStorage = localStorage.getItem('connectedSockets');
            if (currentStorage) {
                var sockets = JSON.parse(currentStorage).map(function (uri) {
                    return io(uri, {reconnectionAttempts: 10});
                });
                this.setState({connectedSockets: sockets});
            }
        } else {
            const storageName = 'connectedSockets';
            chrome.storage.local.get(storageName, result => {
                if (result[storageName]) {
                    var sockets = result[storageName].map(function (uri) {
                        return io(uri, {reconnectionAttempts: 10});
                    });
                    this.setState({connectedSockets: sockets});
                }
            });
        }
    },
    handleUrlSubmit (url) {
        let sockets = this.state.connectedSockets;
        let alreadyExists = false;
        sockets.forEach(socket => {
            if (socket.io.uri === url) {
                alreadyExists = true;
            }
        });
        if (alreadyExists) {
            alert('Url already added.');
        } else {
            if (!chrome.storage) {
                localStorage.setItem(url, JSON.stringify({subbedEvents: []}));
            } else {
                let storageObject = {};
                storageObject[url] = {subbedEvents: []};
                chrome.storage.local.set(storageObject);
            }
            let newSockets = sockets.concat([io(url, {reconnectionAttempts: 10})]);
            this.setState({connectedSockets: newSockets}, () => {
                // update localStorage
                if (!chrome.storage) {
                    localStorage.setItem('connectedSockets', JSON.stringify(this.state.connectedSockets.map(socket => socket.io.uri)));
                } else {
                    let storageObject = {};
                    storageObject.connectedSockets = this.state.connectedSockets.map(socket=>socket.io.uri);
                    chrome.storage.local.set(storageObject);
                }
            });
        }
    },
    handleRemoveSocket (socket) {
        if (!chrome.storage) {
            localStorage.removeItem(socket.io.uri);
            let currentStorage = JSON.parse(localStorage.getItem('connectedSockets'));
            currentStorage = currentStorage.filter(uri => uri !== socket.io.uri);
            localStorage.setItem('connectedSockets', currentStorage);
        } else {
            chrome.storage.local.remove(socket.io.uri);
            let currentStorage;
            chrome.storage.local.get('connectedSockets', object => {
                currentStorage = object.connectedSockets.filter(uri => uri !== socket.io.uri);
                chrome.storage.local.set({connectedSockets: currentStorage});
            });
        }

        let sockets = this.state.connectedSockets;
        let newSockets = sockets.filter(socketObject => socketObject.id !== socket.id);
        this.setState({connectedSockets: newSockets});
        socket.destroy();
    },
    handleClearLocalStorage (event) {
        this.setState({connectedSockets: []}, () => {
            if (!chrome.storage) {
                localStorage.clear();
            } else {
                chrome.storage.local.clear();
            }
        });
    },
    render () {
        // console.log('render Container');
        return (
            <div className="container">
                <h1>Chrome socket.io extension
                    <button onClick={this.handleClearLocalStorage} className="btn btn-default pull-right">Clear localStorage</button>
                </h1>
                <hr />
                <UrlForm onUrlSubmit={this.handleUrlSubmit}/>
                <SocketList connectedSockets={this.state.connectedSockets} onRemoveSocket={this.handleRemoveSocket}/>
            </div>
        );
    }
});
