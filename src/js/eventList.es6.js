/* EventList */
'use strict';
var Event = require('./event.js');

module.exports = React.createClass({
    relayRemoveEvent (eventName) {
        this.props.onRemoveEvent(eventName);
    },
    render () {
        // console.log('render EventList');
        let eventNameNodes = this.props.subscribedEvents.map( eventNameObject => {
            return (
                <Event key={eventNameObject.key} socket={this.props.socket} onRemoveEvent={this.relayRemoveEvent}>
                    {eventNameObject.eventName}
                </Event>
            );
        });
        return (
            <div className="eventNameList">
                {eventNameNodes}
            </div>
        );
    }
});
