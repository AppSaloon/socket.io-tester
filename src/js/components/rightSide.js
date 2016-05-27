import React from 'React';

export var RightSide = React.createClass({
	message: function(message,index){
		var color = {backgroundColor: message.color}
		return (
			<div className={(message.author === 'Me')?'messageContainerMe':'messageContainerSocket'}index={index} key={index}>
				<div className={(message.author === 'Me')?'messageBoxMe':'messageBoxSocket'}>
					<div className="messageEvent">
						<b>Event: </b><span className="messageEventText">{message.event}</span>
					</div>
					<div className="messageType">
						<b>Type: </b><span className="messageTypeText">{message.type}</span>
					</div>
					<div className="messageText">
						<b>Message: </b>
						<p className="textMessage">{message.message}</p>
					</div>
				</div>
				<div className={(message.author === 'Me')?'messageColorMe':'messageColorSocket'} style={color}>
				</div>
			</div>
		)
	},
	render: function(){
		return (
			(this.props.messages.length !== 0)?
				<div className="right">
					 {this.props.messages.map(this.message).reverse()}
				</div>
			:
				/*<div className="right">
					<div className="info">
						<i className="glyphicon glyphicon-remove messageRemove"></i>
						<p className="message">Message</p>
					</div>
				</div>*/
				<div className="right">
					<div>
						<i className="fa fa-long-arrow-up"></i>
						<p className="searchInfo">Text text text</p>
					</div>
					<div className="messageInfoContainer">
						<div className="messageInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>Text text text</p>
						</div>
						<div className="messageInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>Text text text</p>
						</div>
					</div>
					<div className="eventInfoContainer">
						<div>
							<i className="fa fa-long-arrow-left"></i>
							<p>Text text text</p>
						</div>
						<div className="eventInfo">
							<i className="fa fa-long-arrow-left"></i>
							<p>Text text text</p>
						</div>
					</div>
				</div>
		)
	}
})