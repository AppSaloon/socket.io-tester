/* Event */
'use strict';

var EventMessage = require('./eventMessage.js');

module.exports = React.createClass({
    getInitialState () {
        return {
            messages: [],
            limitList: 10
        };
    },
    componentDidMount () {
        this.props.socket.on(this.props.children, message => {
            message = {
                message,
                key: new Date().valueOf()
            };
            let messages = this.state.messages;
            let newMessages = messages.concat([message]);
            if ( newMessages.length > this.state.limitList ) {
                newMessages.shift();
            }
            this.setState({messages: newMessages}, () => {
                //update localStorage
                if ( !chrome.storage ) {
                    let currentStorage = JSON.parse(localStorage.getItem(this.props.socket.io.uri));
                    currentStorage[this.props.children].receivedMessages = this.state.messages;
                    localStorage.setItem(this.props.socket.io.uri, JSON.stringify(currentStorage));
                } else {
                    const storageName = this.props.socket.io.uri;
                    chrome.storage.local.get(storageName, result => {
                        result[storageName][this.props.children].receivedMessages = this.state.messages;
                        chrome.storage.local.set(result);
                    });
                }
            });
        });
    },
    componentWillMount () {
        if ( !chrome.storage ) {
            let currentStorage = JSON.parse(localStorage.getItem(this.props.socket.io.uri));
            this.setState({messages: currentStorage[this.props.children].receivedMessages});
        } else {
            const storageName = this.props.socket.io.uri;
            chrome.storage.local.get(storageName, result => {
                this.setState({messages: result[storageName][this.props.children].receivedMessages});
            });
        }
    },
    componentWillUnmount () {
        this.props.socket.off(this.props.children);
    },
    handleSubmit (event) {
        event.preventDefault();
        let message = React.findDOMNode(this.refs.message).value.trim();
        if ( !message ) {
            return;
        }
        try {
            message = JSON.stringify(message);
        }
        catch (error) {}
        React.findDOMNode(this.refs.message).value = '';
        this.props.socket.emit(this.props.children, message);
    },
    removeEvent (event) {
        this.props.onRemoveEvent(this.props.children);
    },
    updateLimitList (event) {
        const inputValue = parseInt(event.target.value);
        if ( inputValue > 0 && inputValue < 10000 ) {
            let messages = this.state.messages;
            let messagesLength = messages.length;
            if ( messagesLength > inputValue ) {
                messages = messages.slice(messagesLength-inputValue);
            }
            this.setState({messages, limitList: inputValue});
        }
    },
    handleClear (event) {
        this.setState({messages: []}, () => {
            if ( !chrome.storage ) {
                let currentStorage = JSON.parse(localStorage.getItem(this.props.socket.io.uri));
                currentStorage[this.props.children].receivedMessages = [];
                localStorage.setItem(this.props.socket.io.uri, JSON.stringify(currentStorage));
            } else {
                const storageName = this.props.socket.io.uri;
                chrome.storage.local.get(storageName, result => {
                    result[storageName][this.props.children].receivedMessages = [];
                    chrome.storage.local.set(result);
                });
            }
        });
    },
    handleCollapse (event) {
        $(React.findDOMNode(this.refs.collapse)).collapse('toggle');
    },
    render () {
        // console.log('render Event');
        let messageNodes = this.state.messages.map(function (message) {
            return (
                <EventMessage key={message.key}>
                    {message}
                </EventMessage>
            );
        });
        let eventName = this.props.children;
        let headingId = `heading${eventName}`;
        let collapseId = `collapse${eventName}`;
        let hashCollapseId = `#collapse${eventName}`;
        return (
            <div className="eventName">
                <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id={headingId} onClick={this.handleCollapse}>
                        <h5>Event: {this.props.children} <span onClick={this.removeEvent} className="glyphicon glyphicon-remove"></span></h5>
                    </div>
                    <div id={collapseId} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="{headingId}" ref="collapse">
                        <div className="panel-body">
                            <div className="input-group col-sm-2">
                                <span className="input-group-addon">Limit to</span>
                                <input className="form-control" type="number" onChange={this.updateLimitList} value={this.state.limitList}></input>
                            </div>
                            <form className="form-inline" onSubmit={this.handleSubmit}>
                                <label>Send a message with this event name</label>
                                <div className="input-group">
                                    <input type="text" placeholder="Message" className="form-control" ref="message"></input>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" type="submit">Send</button>
                                    </span>
                                </div>
                            </form>
                            <button onClick={this.handleClear} className="btn btn-default">Clear messages</button>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{width: "70%"}}>Message</th>
                                        <th>Sent at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messageNodes}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
