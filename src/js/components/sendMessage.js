import React from 'react';

export const SendMessage = React.createClass({
	getInitialState : function () {
		return {}
	},
	componentDidMount: function() {
		var source = this.props.events.map(function (event) {
			return event.name
		})
		$( "#qsd" ).autocomplete({
	      source: source
	    });
	},
	checkError: function(event, message, tab){
		this.setState({errorEvent: 'event', errorTextarea: null})
		if (event === '') {
			this.setState({errorEvent: 'errorEvent'})
			if (message === ''){
				this.setState({errorTextarea: 'errorTextarea'})
			}
		} else {
			this.setState({errorTextarea: 'errorTextarea'})
		}
	},
	addMessage: function (e) {
		e.preventDefault();
		var event = this.refs.eventText.value;
		var message = this.refs.textOfMessage.value;
		var type = this.state.messageType;
		var errorMessage = "Please fill in all form fields!"
		if (event != '' && message != '') {
			this.props.addMessage(event, message, type);
			this.refs.form.reset();
			this.setState({errorMessage: null, errorTextarea: null, errorEvent: 'event', messageType: '--'})
		} else {
			this.setState({errorMessage: errorMessage})
			this.checkError(event, message);
		}
	},
	changeType: function () {
		var message = this.refs.textOfMessage.value;
		var messageType = this.props.type;
		if(message != ''){
			try {
				var x = JSON.parse(message);
				messageType = 'Json';
			}
			catch(err){
				messageType = 'String';
			}
		} else {
			messageType = '--'
		}
		this.setState({messageType: messageType})
	},
	render: function(){
		return (
			<div className="sendMessage">
				<h3>Send Message</h3>
				<form ref='form' onSubmit={this.addMessage}>
					<div>
						<input 
							className={this.state.errorEvent || 'event'}
							type="text"
							ref="eventText" 
							id="qsd"
							placeholder="Event name"	
							size="30"
						/>
						<span className="glyphicon glyphicon-collapse-down"></span>
					</div>
					<p className="textareaType">{this.state.messageType || '--'}</p>
					<textarea 
						name="message" 
						className={this.state.errorTextarea}
						rows="7" 
						cols="30" 
						placeholder="String, json" 
						ref="textOfMessage" 
						onChange={this.changeType}
					>
					</textarea>
					<p className="errorMessage">{this.state.errorMessage}</p>
					<button className="button" type="button" onClick={this.addMessage}>Send message</button>
				</form>
			</div>
		)
	}
})