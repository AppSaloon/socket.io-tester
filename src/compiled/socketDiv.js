/* SocketDiv */
'use strict';
var ConnectionStatus = require('./connectionStatus.js');
var EventList = require('./eventList.js');

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return { subscribedEvents: [] };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        if (!chrome.storage) {
            var currentStorage = JSON.parse(localStorage.getItem(this.props.children));
            this.setState({ subscribedEvents: currentStorage.subbedEvents });
        } else {
            (function () {
                var storageName = _this.props.children;
                chrome.storage.local.get(storageName, function (result) {
                    _this.setState({ subscribedEvents: result[storageName].subbedEvents });
                });
            })();
        }
    },
    handleSubscribe: function handleSubscribe() {
        var _this2 = this;

        event.preventDefault();
        var eventName = React.findDOMNode(this.refs.newEventName).value.trim();
        if (!eventName) {
            return;
        }
        eventName = {
            eventName: eventName,
            key: new Date().valueOf()
        };
        var eventNames = this.state.subscribedEvents;
        if (eventNames.filter(function (storedEventName) {
            return storedEventName.eventName === eventName.eventName;
        }).length) {
            alert('Already listening to this event.');
            return;
        }
        var newEvents = eventNames.concat([eventName]);
        if (!chrome.storage) {
            var currentStorage = JSON.parse(localStorage.getItem(this.props.children));
            currentStorage[eventName.eventName] = { receivedMessages: [] };
            localStorage.setItem(this.props.children, JSON.stringify(currentStorage));
        } else {
            chrome.storage.local.get(this.props.children, function (result) {
                result[_this2.props.children][eventName.eventName] = { receivedMessages: [] };
                result[_this2.props.children].subbedEvents = newEvents;
                chrome.storage.local.set(result, function () {
                    _this2.setState({ subscribedEvents: newEvents });
                });
            });
        }
        if (!chrome.storage) {
            this.setState({ subscribedEvents: newEvents }, function () {
                var currentStorage = JSON.parse(localStorage.getItem(_this2.props.children));
                currentStorage.subbedEvents = _this2.state.subscribedEvents;
                localStorage.setItem(_this2.props.children, JSON.stringify(currentStorage));
            });
        }
        React.findDOMNode(this.refs.newEventName).value = '';
    },
    handleRemoveEvent: function handleRemoveEvent(eventName) {
        var _this3 = this;

        if (!chrome.storage) {
            var currentStorage = JSON.parse(localStorage.getItem(this.props.children));
            currentStorage.subbedEvents = currentStorage.subbedEvents.filter(function (eventObject) {
                return eventObject.eventName !== eventName;
            });
            delete currentStorage[eventName];
            localStorage.setItem(this.props.children, JSON.stringify(currentStorage));
        } else {
            chrome.storage.local.get(this.props.children, function (result) {
                result[_this3.props.children].subbedEvents = result[_this3.props.children].subbedEvents.filter(function (eventObject) {
                    return eventObject.eventName !== eventName;
                });
                delete result[_this3.props.children][eventName];
                chrome.storage.local.set(result);
            });
        }

        var eventNames = this.state.subscribedEvents;
        var newEvents = eventNames.filter(function (object) {
            return object.eventName !== eventName;
        });
        this.setState({ subscribedEvents: newEvents });
        this.props.socket.off(eventName);
    },
    removeSocket: function removeSocket() {
        this.props.onRemoveSocket(this.props.socket);
    },
    handleSend: function handleSend(event) {
        event.preventDefault();
        var message = React.findDOMNode(this.refs.message).value.trim();
        var eventName = React.findDOMNode(this.refs.eventName).value.trim();
        if (!eventName || !message) {
            return;
        }
        try {
            message = JSON.stringify(message);
        } catch (error) {}
        this.props.socket.emit(eventName, message);
        React.findDOMNode(this.refs.eventName).value = '';
        React.findDOMNode(this.refs.message).value = '';
    },
    handleCollapse: function handleCollapse(event) {
        $(React.findDOMNode(this.refs.collapse)).collapse('toggle');
    },
    render: function render() {
        // console.log('render SocketDiv');
        var timestamp = new Date().valueOf();
        var headingId = 'heading' + timestamp;
        var collapseId = 'collapse' + timestamp;
        var hashCollapseId = '#collapse' + timestamp;
        return React.createElement(
            'div',
            { className: 'socketDiv' },
            React.createElement(
                'div',
                { className: 'panel panel-default' },
                React.createElement(
                    'div',
                    { className: 'panel-heading', role: 'tab', id: headingId, onClick: this.handleCollapse },
                    React.createElement(
                        'h4',
                        { className: 'panel-title' },
                        this.props.children,
                        ' ',
                        React.createElement('span', { onClick: this.removeSocket, className: 'glyphicon glyphicon-remove' }),
                        ' ',
                        React.createElement(ConnectionStatus, { socket: this.props.socket })
                    )
                ),
                React.createElement(
                    'div',
                    { id: collapseId, className: 'panel-collapse collapse in', role: 'tabpanel', 'aria-labelledby': headingId, ref: 'collapse' },
                    React.createElement(
                        'div',
                        { className: 'panel-body' },
                        React.createElement(
                            'div',
                            { className: 'col-sm-12' },
                            React.createElement(
                                'form',
                                { onSubmit: this.handleSend },
                                React.createElement(
                                    'label',
                                    { className: 'control-label' },
                                    'Send a message'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'form-group' },
                                    React.createElement(
                                        'label',
                                        null,
                                        'Event name'
                                    ),
                                    React.createElement('input', { className: 'form-control', placeholder: 'Event name', type: 'text', ref: 'eventName' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        'Message'
                                    ),
                                    React.createElement('input', { className: 'form-control', placeholder: 'Message', type: 'text', ref: 'message' }),
                                    React.createElement(
                                        'button',
                                        { className: 'btn btn-default', type: 'submit' },
                                        'Send'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-12' },
                            React.createElement(
                                'form',
                                { onSubmit: this.handleSubscribe },
                                React.createElement(
                                    'label',
                                    { className: 'control-label' },
                                    'Listen for events'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'input-group' },
                                    React.createElement('input', { type: 'text', placeholder: 'Event name', className: 'form-control', ref: 'newEventName' }),
                                    React.createElement(
                                        'span',
                                        { className: 'input-group-btn' },
                                        React.createElement(
                                            'button',
                                            { className: 'btn btn-default', type: 'submit' },
                                            'Add'
                                        )
                                    )
                                )
                            ),
                            React.createElement('hr', null),
                            React.createElement(EventList, { socket: this.props.socket, subscribedEvents: this.state.subscribedEvents, onRemoveEvent: this.handleRemoveEvent })
                        )
                    )
                )
            )
        );
    }
});