import React, { Component } from 'react';
import ObjectInspector from 'react-inspector';

export var RightSide = React.createClass({
	render: function(){
		let content;
		const error = this.props.error;
		if ( error ) {
			content = (
				<div className="right">
					<div className="error">
						<h3><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> {error}</h3>
					</div>
				</div>
			);
		} else if ( this.props.messages.length !== 0 ) {
			content = <Messages url={this.props.url} events={this.props.events} messages={this.props.messages} />
		} else {
			content = (
				<div className="right">
					<div>
						<i className="fa fa-long-arrow-up"></i>
						<p className="searchInfo">you can enter a url and refresh with the button to the left. On the top is a tab bar where you can add and delete tabs</p>
					</div>
					<div className="messageInfoContainer">
						<div className="messageInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>Here you can choose an event out of the list of events you added</p>
						</div>
						<div className="messageInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>You can enter the string or JSON that you want to send in this textfield.</p>
						</div>
					</div>
					<div className="eventInfoContainer">
						<div>
							<i className="fa fa-long-arrow-left"></i>
							<p>This shows your list of events with their respective colors. You can filter the messages shown by checking the checkboxes, delete an event by clicking the cross that shows when you hover over the event and change the color of the event by clicking on the color</p>
						</div>
						<div className="eventInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>Here you can add an event and pick a color for it</p>
						</div>
					</div>
				</div>
			);
		}
		return content;
	}
})

class Messages extends Component {
	constructor (props) {
		super(props)

		this.message = this.message.bind(this)
	}

	message (message, index) {
		const color = this.props.events.find(function(e){
			return e.name === message.event;
		}).color;
		return <MessageDiv url={this.props.url} color={color} key={message.id} message={message}/>;
	}

	render () {
		const messagesToRender = this.props.messages
		return (
			<div className="right">
				{messagesToRender.map(this.message).reverse()}
			</div>
		)
	}
}

class MessageDiv extends Component {
	shouldComponentUpdate(nextProps, nextState) {
	    return false;
	}
	render () {
		const message = this.props.message;
		const color = {borderColor: this.props.color};
		let data;
		const showObject = message.type === 'JSON'||message.type === 'Object'
		if (showObject) {
			try {
				data = JSON.parse(message.message);
			}
			catch (error) {
				data = message.message
			}
		}
		return (
			<div className={(message.author === 'Me')?'messageContainerMe':'messageContainerSocket'}>
				<div className={(message.author === 'Me')?'messageBoxMe':'messageBoxSocket'} style={color}>
					<div className="messageEvent">
						<b>Event: </b><span className="messageEventText">{message.event}</span>
					</div>
					<div className="messageType">
						<b>Type: </b><span className="messageTypeText">{message.type}</span>
					</div>
					<div className="messageText">
						<b>Message: </b>
						<p className="textMessage" style={(showObject)?{display: "none"}:null}>{!showObject?message.message:null}</p>
						{data?
							<div className="objectContainer">
								<ObjectInspector data={data} />
							</div>
						:null}
					</div>
				</div>
			</div>
		);
	}
}
