/* SocketDiv */
'use strict';
var ConnectionStatus = require('./connectionStatus.js');
var EventList = require('./eventList.js');

module.exports = React.createClass({
    getInitialState () {
        return {subscribedEvents: []};
    },
    componentWillMount () {
        if ( !chrome.storage ) {
            let currentStorage = JSON.parse(localStorage.getItem(this.props.children));
            this.setState({subscribedEvents: currentStorage.subbedEvents});
        } else {
            const storageName = this.props.children;
            chrome.storage.local.get(storageName, result => {
                this.setState({subscribedEvents: result[storageName].subbedEvents});
            });
        }
    },
    handleSubscribe () {
        event.preventDefault();
        let eventName = React.findDOMNode(this.refs.newEventName).value.trim();
        if ( !eventName ) {
            return;
        }
        eventName = {
            eventName,
            key: new Date().valueOf()
        }
        let eventNames = this.state.subscribedEvents;
        if ( eventNames.filter( storedEventName => storedEventName.eventName === eventName.eventName ).length ) {
            alert('Already listening to this event.');
            return;
        }
        let newEvents = eventNames.concat([eventName]);
            if ( !chrome.storage ) {
                let currentStorage = JSON.parse(localStorage.getItem(this.props.children));
                currentStorage[eventName.eventName] = {receivedMessages: []};
                localStorage.setItem(this.props.children, JSON.stringify(currentStorage));
             } else {
                chrome.storage.local.get(this.props.children, result => {
                    result[this.props.children][eventName.eventName] = {receivedMessages: []};
                    result[this.props.children].subbedEvents = newEvents;
                    chrome.storage.local.set(result, () => {
                        this.setState({subscribedEvents: newEvents});
                    });
                });
            }
        if ( !chrome.storage ) {
            this.setState({subscribedEvents: newEvents}, () => {
                let currentStorage = JSON.parse(localStorage.getItem(this.props.children));
                currentStorage.subbedEvents = this.state.subscribedEvents;
                localStorage.setItem(this.props.children, JSON.stringify(currentStorage));
            });
        }
        React.findDOMNode(this.refs.newEventName).value = '';
    },
    handleRemoveEvent(eventName) {
        if ( !chrome.storage ) {
            let currentStorage = JSON.parse(localStorage.getItem(this.props.children));
            currentStorage.subbedEvents = currentStorage.subbedEvents.filter(eventObject => eventObject.eventName !== eventName);
            delete currentStorage[eventName];
            localStorage.setItem(this.props.children, JSON.stringify(currentStorage));
        } else {
            chrome.storage.local.get(this.props.children, result => {
                result[this.props.children].subbedEvents = result[this.props.children].subbedEvents.filter(eventObject => eventObject.eventName !== eventName);
                delete result[this.props.children][eventName];
                chrome.storage.local.set(result);
            });
        }

        let eventNames = this.state.subscribedEvents;
        let newEvents = eventNames.filter(object => object.eventName !== eventName);
        this.setState({subscribedEvents: newEvents});
        this.props.socket.off(eventName);
    },
    removeSocket () {
        this.props.onRemoveSocket(this.props.socket);
    },
    handleSend (event) {
        event.preventDefault();
        let message = React.findDOMNode(this.refs.message).value.trim();
        let eventName = React.findDOMNode(this.refs.eventName).value.trim();
        if ( !eventName || !message ) {
            return;
        }
        try {
            message = JSON.stringify(message);
        }
        catch (error) {}
        this.props.socket.emit(eventName, message);
        React.findDOMNode(this.refs.eventName).value = '';
        React.findDOMNode(this.refs.message).value = '';
    },
    handleCollapse (event) {
        $(React.findDOMNode(this.refs.collapse)).collapse('toggle');
    },
    render () {
        // console.log('render SocketDiv');
        let timestamp = new Date().valueOf();
        let headingId = `heading${timestamp}`;
        let collapseId = `collapse${timestamp}`;
        let hashCollapseId = `#collapse${timestamp}`;
        return (
            <div className='socketDiv'>
                <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id={headingId} onClick={this.handleCollapse}>
                        <h4 className="panel-title">{this.props.children} <span onClick={this.removeSocket} className="glyphicon glyphicon-remove"></span> <ConnectionStatus socket={this.props.socket} /></h4>
                    </div>
                    <div id={collapseId} className="panel-collapse collapse in" role="tabpanel" aria-labelledby={headingId} ref="collapse">
                        <div className="panel-body">
                            <div className="col-sm-12">
                                <form onSubmit={this.handleSend}>
                                    <label className="control-label">Send a message</label>
                                    <div className="form-group">
                                        <label>Event name</label>
                                        <input className="form-control" placeholder="Event name" type="text" ref="eventName"></input>
                                        <label>Message</label>
                                        <input className="form-control" placeholder="Message" type="text" ref="message"></input>
                                        <button className="btn btn-default" type="submit">Send</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-sm-12">
                                <form onSubmit={this.handleSubscribe}>
                                    <label className="control-label">Listen for events</label>
                                    <div className="input-group">
                                        <input type="text" placeholder="Event name" className="form-control" ref="newEventName"></input>
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" type="submit">Add</button>
                                        </span>
                                    </div>
                                </form>
                                <hr />
                                <EventList socket={this.props.socket} subscribedEvents={this.state.subscribedEvents} onRemoveEvent={this.handleRemoveEvent} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
