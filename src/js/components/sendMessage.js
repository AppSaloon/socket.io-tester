import React from 'react';
import Autocomplete from 'react-autocomplete'

export const SendMessage = React.createClass({
	getInitialState : function () {
		return {
			value: "",
			errorEvent: "autocompleteContainer"
		}
	},
	checkError: function(event, message, tab){
		this.setState({errorEvent: 'autocompleteContainer', errorTextarea: null})
		if (event === '') {
			this.setState({errorEvent: 'errorEventMessage'})
			if (message === ''){
				this.setState({errorTextarea: 'errorTextarea'})
			}
		} else {
			this.setState({errorTextarea: 'errorTextarea'})
		}
	},
	addMessage: function (e) {
		e.preventDefault();
		var event = this.state.value;
		var message = this.refs.textOfMessage.value;
		var type = this.state.messageType;
		var errorMessage = "Please fill in all form fields!";
		if (event != '' && message != '') {
			this.props.addMessage(event, message, type);
			this.state.value = "";
			this.refs.form.reset();
			this.setState({errorMessage: null, errorTextarea: null, errorEvent: 'autocompleteContainer', messageType: '--'});
		} else {
			this.setState({errorMessage: errorMessage});
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
	getEventList() {
		let events = this.props.events || [{}];
		if ( events.length === 1 && !events[0].name ) {
			events = [];
		}
		return events;
	},
	render: function(){
		return (
			<div className="sendMessage">
				<h3>Send Message</h3>
				<form ref='form' onSubmit={this.addMessage}>
					<div className={this.state.errorEvent}>
						<Autocomplete
							value={this.state.value}
							items={this.getEventList()}
							getItemValue={(item) => item.name}
							onChange={(event, value) => this.setState({value})}
          					onSelect={value => this.setState({value})}
							renderItem={(item, isHighlighted) => (
            					<div className={isHighlighted ? "autocompleteItemSelected" : "autocompleteItem"}>
									{item.name}
								</div>
         					)}
						/>
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