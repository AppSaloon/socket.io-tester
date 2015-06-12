/* Container */
'use strict';
var UrlForm = require('./urlForm.js');
var SocketList = require('./socketList.js');

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return { connectedSockets: [] };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        if (!chrome.storage) {
            var currentStorage = localStorage.getItem('connectedSockets');
            if (currentStorage) {
                var sockets = JSON.parse(currentStorage).map(function (uri) {
                    return io(uri, { reconnectionAttempts: 10 });
                });
                this.setState({ connectedSockets: sockets });
            }
        } else {
            (function () {
                var storageName = 'connectedSockets';
                chrome.storage.local.get(storageName, function (result) {
                    if (result[storageName]) {
                        var sockets = result[storageName].map(function (uri) {
                            return io(uri, { reconnectionAttempts: 10 });
                        });
                        _this.setState({ connectedSockets: sockets });
                    }
                });
            })();
        }
    },
    handleUrlSubmit: function handleUrlSubmit(urlObject) {
        var _this2 = this;

        var fullUrl = urlObject.url + ':' + urlObject.port;
        var sockets = this.state.connectedSockets;
        var alreadyExists = false;
        sockets.forEach(function (socket) {
            if (socket.io.uri === fullUrl) {
                alreadyExists = true;
            }
        });
        if (alreadyExists) {
            alert('Url already added.');
        } else {
            if (!chrome.storage) {
                localStorage.setItem(fullUrl, JSON.stringify({ subbedEvents: [] }));
            } else {
                var storageObject = {};
                storageObject[fullUrl] = { subbedEvents: [] };
                chrome.storage.local.set(storageObject);
            }
            var newSockets = sockets.concat([io(fullUrl, { reconnectionAttempts: 10 })]);
            this.setState({ connectedSockets: newSockets }, function () {
                // update localStorage
                if (!chrome.storage) {
                    localStorage.setItem('connectedSockets', JSON.stringify(_this2.state.connectedSockets.map(function (socket) {
                        return socket.io.uri;
                    })));
                } else {
                    var storageObject = {};
                    storageObject.connectedSockets = _this2.state.connectedSockets.map(function (socket) {
                        return socket.io.uri;
                    });
                    chrome.storage.local.set(storageObject);
                }
            });
        }
    },
    handleRemoveSocket: function handleRemoveSocket(socket) {
        if (!chrome.storage) {
            localStorage.removeItem(socket.io.uri);
            var currentStorage = JSON.parse(localStorage.getItem('connectedSockets'));
            currentStorage = currentStorage.filter(function (uri) {
                return uri !== socket.io.uri;
            });
            localStorage.setItem('connectedSockets', currentStorage);
        } else {
            (function () {
                chrome.storage.local.remove(socket.io.uri);
                var currentStorage = undefined;
                chrome.storage.local.get('connectedSockets', function (object) {
                    currentStorage = object.connectedSockets.filter(function (uri) {
                        return uri !== socket.io.uri;
                    });
                    chrome.storage.local.set({ connectedSockets: currentStorage });
                });
            })();
        }

        var sockets = this.state.connectedSockets;
        var newSockets = sockets.filter(function (socketObject) {
            return socketObject.id !== socket.id;
        });
        this.setState({ connectedSockets: newSockets });
        socket.destroy();
    },
    handleClearLocalStorage: function handleClearLocalStorage(event) {
        this.setState({ connectedSockets: [] }, function () {
            if (!chrome.storage) {
                localStorage.clear();
            } else {
                chrome.storage.local.clear();
            }
        });
    },
    render: function render() {
        // console.log('render Container');
        return React.createElement(
            'div',
            { className: 'container' },
            React.createElement(
                'h1',
                null,
                'Chrome socket.io extension',
                React.createElement(
                    'button',
                    { onClick: this.handleClearLocalStorage, className: 'btn btn-default pull-right' },
                    'Clear localStorage'
                )
            ),
            React.createElement('hr', null),
            React.createElement(UrlForm, { onUrlSubmit: this.handleUrlSubmit }),
            React.createElement(SocketList, { connectedSockets: this.state.connectedSockets, onRemoveSocket: this.handleRemoveSocket })
        );
    }
});