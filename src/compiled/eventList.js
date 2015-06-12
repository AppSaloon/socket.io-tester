/* EventList */
'use strict';
var Event = require('./event.js');

module.exports = React.createClass({
    displayName: 'exports',

    relayRemoveEvent: function relayRemoveEvent(eventName) {
        this.props.onRemoveEvent(eventName);
    },
    render: function render() {
        var _this = this;

        // console.log('render EventList');
        var eventNameNodes = this.props.subscribedEvents.map(function (eventNameObject) {
            return React.createElement(
                Event,
                { key: eventNameObject.key, socket: _this.props.socket, onRemoveEvent: _this.relayRemoveEvent },
                eventNameObject.eventName
            );
        });
        return React.createElement(
            'div',
            { className: 'eventNameList' },
            eventNameNodes
        );
    }
});