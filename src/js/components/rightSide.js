import React, { Component } from 'react';
import ObjectInspector from 'react-object-inspector';

export var RightSide = React.createClass({
	message: function(message, index){
		const color = this.props.events.find(function(e){
			return e.name === message.event;
		}).color;
		return <MessageDiv url={this.props.url} color={color} key={index} message={message}/>;
	},
	render: function(){
		return (
			(this.props.messages.length !== 0)?
				<div className="right">
					 {this.props.messages.map(this.message).reverse()}
				</div>
			:
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
		)
	}
})

class MessageDiv extends Component {
	// constructor(props) {
	// 	super(props);

		// this.state = {
		// 	color: props.message.color
		// };

	// 	this.eventListener = this.eventListener.bind(this);
	// }
	// componentDidMount () {
	// 	document.addEventListener(`colorChange_${this.props.url}_${this.props.message.event.replace(' ', '-')}`, this.eventListener);
	// }
	// componentWillUnmount () {
	// 	document.removeEventListener(`colorChange_${this.props.url}_${this.props.message.event.replace(' ', '-')}`, this.eventListener);
	// }
	// eventListener (e) {
	// 	console.log('someelistener');
	// 	this.setState({
	// 		color: e.detail.newColor
	// 	});
	// }
	render () {
		const message = this.props.message;
		const color = {backgroundColor: this.props.color};
		// const color = {backgroundColor: this.state.color};
		let data;
		if (message.type === 'Json') {
			data = JSON.parse(message.message);
		}
		return (
			<div className={(message.author === 'Me')?'messageContainerMe':'messageContainerSocket'}>
				<div className={(message.author === 'Me')?'messageBoxMe':'messageBoxSocket'}>
					<div className="messageEvent">
						<b>Event: </b><span className="messageEventText">{message.event}</span>
					</div>
					<div className="messageType">
						<b>Type: </b><span className="messageTypeText">{message.type}</span>
					</div>
					<div className="messageText">
						<b>Message: </b>
						<p className="textMessage" style={(message.type === 'Json')?{display: "none"}:null}>{message.message}</p>
						<div className="objectContainer" style={(message.type === 'String')? {display: 'none'}: null}>
							<ObjectInspector data={data} />
						</div>
					</div>
				</div>
				<div className={(message.author === 'Me')?'messageColorMe':'messageColorSocket'} style={color}>
				</div>
			</div>
		);
	}
}
