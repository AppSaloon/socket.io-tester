/* Event */
'use strict';

var EventMessage = require('./eventMessage.js');

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            messages: [],
            limitList: 10
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.props.socket.on(this.props.children, function (message) {
            message = {
                message: message,
                key: new Date().valueOf()
            };
            var messages = _this.state.messages;
            var newMessages = messages.concat([message]);
            if (newMessages.length > _this.state.limitList) {
                newMessages.shift();
            }
            _this.setState({ messages: newMessages }, function () {
                //update localStorage
                if (!chrome.storage) {
                    var currentStorage = JSON.parse(localStorage.getItem(_this.props.socket.io.uri));
                    currentStorage[_this.props.children].receivedMessages = _this.state.messages;
                    localStorage.setItem(_this.props.socket.io.uri, JSON.stringify(currentStorage));
                } else {
                    (function () {
                        var storageName = _this.props.socket.io.uri;
                        chrome.storage.local.get(storageName, function (result) {
                            result[storageName][_this.props.children].receivedMessages = _this.state.messages;
                            chrome.storage.local.set(result);
                        });
                    })();
                }
            });
        });
    },
    componentWillMount: function componentWillMount() {
        var _this2 = this;

        if (!chrome.storage) {
            var currentStorage = JSON.parse(localStorage.getItem(this.props.socket.io.uri));
            this.setState({ messages: currentStorage[this.props.children].receivedMessages });
        } else {
            (function () {
                var storageName = _this2.props.socket.io.uri;
                chrome.storage.local.get(storageName, function (result) {
                    _this2.setState({ messages: result[storageName][_this2.props.children].receivedMessages });
                });
            })();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.props.socket.off(this.props.children);
    },
    handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        var message = React.findDOMNode(this.refs.message).value.trim();
        if (!message) {
            return;
        }
        try {
            message = JSON.stringify(message);
        } catch (error) {}
        React.findDOMNode(this.refs.message).value = '';
        this.props.socket.emit(this.props.children, message);
    },
    removeEvent: function removeEvent(event) {
        this.props.onRemoveEvent(this.props.children);
    },
    updateLimitList: function updateLimitList(event) {
        var inputValue = parseInt(event.target.value);
        if (inputValue > 0 && inputValue < 10000) {
            var messages = this.state.messages;
            var messagesLength = messages.length;
            if (messagesLength > inputValue) {
                messages = messages.slice(messagesLength - inputValue);
            }
            this.setState({ messages: messages, limitList: inputValue });
        }
    },
    handleClear: function handleClear(event) {
        var _this3 = this;

        this.setState({ messages: [] }, function () {
            if (!chrome.storage) {
                var currentStorage = JSON.parse(localStorage.getItem(_this3.props.socket.io.uri));
                currentStorage[_this3.props.children].receivedMessages = [];
                localStorage.setItem(_this3.props.socket.io.uri, JSON.stringify(currentStorage));
            } else {
                (function () {
                    var storageName = _this3.props.socket.io.uri;
                    chrome.storage.local.get(storageName, function (result) {
                        result[storageName][_this3.props.children].receivedMessages = [];
                        chrome.storage.local.set(result);
                    });
                })();
            }
        });
    },
    handleCollapse: function handleCollapse(event) {
        $(React.findDOMNode(this.refs.collapse)).collapse('toggle');
    },
    render: function render() {
        // console.log('render Event');
        var messageNodes = this.state.messages.map(function (message) {
            return React.createElement(
                EventMessage,
                { key: message.key },
                message
            );
        });
        var eventName = this.props.children;
        var headingId = 'heading' + eventName;
        var collapseId = 'collapse' + eventName;
        var hashCollapseId = '#collapse' + eventName;
        return React.createElement(
            'div',
            { className: 'eventName' },
            React.createElement(
                'div',
                { className: 'panel panel-default' },
                React.createElement(
                    'div',
                    { className: 'panel-heading', role: 'tab', id: headingId, onClick: this.handleCollapse },
                    React.createElement(
                        'h5',
                        null,
                        'Event: ',
                        this.props.children,
                        ' ',
                        React.createElement('span', { onClick: this.removeEvent, className: 'glyphicon glyphicon-remove' })
                    )
                ),
                React.createElement(
                    'div',
                    { id: collapseId, className: 'panel-collapse collapse in', role: 'tabpanel', 'aria-labelledby': '{headingId}', ref: 'collapse' },
                    React.createElement(
                        'div',
                        { className: 'panel-body' },
                        React.createElement(
                            'div',
                            { className: 'input-group col-sm-2' },
                            React.createElement(
                                'span',
                                { className: 'input-group-addon' },
                                'Limit to'
                            ),
                            React.createElement('input', { className: 'form-control', type: 'number', onChange: this.updateLimitList, value: this.state.limitList })
                        ),
                        React.createElement(
                            'form',
                            { className: 'form-inline', onSubmit: this.handleSubmit },
                            React.createElement(
                                'label',
                                null,
                                'Send a message with this event name'
                            ),
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement('input', { type: 'text', placeholder: 'Message', className: 'form-control', ref: 'message' }),
                                React.createElement(
                                    'span',
                                    { className: 'input-group-btn' },
                                    React.createElement(
                                        'button',
                                        { className: 'btn btn-default', type: 'submit' },
                                        'Send'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'button',
                            { onClick: this.handleClear, className: 'btn btn-default' },
                            'Clear messages'
                        ),
                        React.createElement(
                            'table',
                            { className: 'table' },
                            React.createElement(
                                'thead',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'th',
                                        { style: { width: '70%' } },
                                        'Message'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Sent at'
                                    )
                                )
                            ),
                            React.createElement(
                                'tbody',
                                null,
                                messageNodes
                            )
                        )
                    )
                )
            )
        );
    }
});