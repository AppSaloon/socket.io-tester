import React from 'react';
import Autocomplete from 'react-autocomplete'

export const SendMessage = React.createClass({
	getInitialState : function () {
		return {
			value: "",
			errorEvent: "autocompleteContainer",
			messageType: '--',
			message: ''
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
		var message = this.state.message.slice();
		var type = this.state.messageType;
		if ( type === 'JSON' ) {
			message = JSON.parse(message)
		}
		var errorMessage = "Please fill in all form fields!";
		if ( event && message ) {
			this.props.addMessage(event, message, type);
			this.setState({errorMessage: null, errorTextarea: null, errorEvent: 'autocompleteContainer'});
		} else {
			this.setState({errorMessage: errorMessage});
			this.checkError(event, message);
		}
	},

	changeMessage (e) {
		const message = e.target.value
		const messageType = this.getNewType(message)
		this.setState({
			message,
			messageType
		})
	},

	getNewType (message) {
		let result
		if ( message !== '' ) {
			try {
				JSON.parse(message);
				result = 'JSON';
			}
			catch(err){
				result = 'String';
			}
		} else {
			result = '--'
		}
		return result
	},
	getEventList() {
		let events = this.props.events.slice();
		if ( !events[0].name ) {
			events[0] = {name:''};
		}
		if ( events.length !== 1 && !events[0].name ) {
			events = events.slice(1);
		}
		return events;
	},


	matchStateToTerm (state, value) {
	  	return (
		    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
	  	)
	},

	sortStates (a, b, value) {
	  	return (
		    a.name.toLowerCase().indexOf(value.toLowerCase()) >
		    b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
	  	)
	},

	clearTextField (e) {
		e.preventDefault()
		return this.setState({
			message: '',
			messageType: '--'
		});
	},


	render: function(){
		return (
			<div className="sendMessage">
				<h3>Send Message</h3>
				<form onSubmit={this.addMessage}>
					<div className={this.state.errorEvent}>
						<Autocomplete
							menuStyle={{
								left: 10,
								top: 70,
								minWidth: 220,
								borderRadius: 3,
								boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 2px 12px",
								padding: "2px 0px",
								fontSize: "90%",
							    position: "fixed",
							    overflow: "auto",
							    maxHeight: "50%",
							    background: "rgba(255, 255, 255, 0.901961)"
							}}
							value={this.state.value}
							items={this.getEventList()}
							getItemValue={(item) => item.name}
          					shouldItemRender={this.matchStateToTerm}
          					sortItems={this.sortStates}
							onChange={(event, value) => this.setState({value})}
          					onSelect={value => this.setState({value})}
							renderItem={(item, isHighlighted) => (
            					<div
            						className={isHighlighted ? "autocompleteItemSelected" : "autocompleteItem"}
              						key={item.name}
          						>
									{item.name}
								</div>
         					)}


						/>
					</div>
					<p className="textareaType">{this.state.messageType} 
						<span>
							<button className="clear_button" onClick={this.clearTextField}>Clear</button>
						</span>
					</p>
					<textarea 
						name="message"
						className={this.state.errorTextarea}
						rows="7" 
						cols="30" 
						placeholder="String, JSON" 
						value={this.state.message}
						onChange={this.changeMessage}
					>
					</textarea>
					<p className="errorMessage">{this.state.errorMessage}</p>
					<input className="button" type="submit" value="Send message" />
				</form>
			</div>
		)
	}
})