import React from 'React';

export var ListenEvent = React.createClass({
	getInitialState: function(){
		return {}
	},
	handleClick: function(e,item){
		var index = parseInt(item.split('$')[1].split('.')[0])
		this.props.checkEvent(index)
	},
	updateAutocomplete: function(){
		var source = this.props.events.map(function (event) {
			return event.name
		})
		$( "#qsd" ).autocomplete({
	      source: source
	    });
	},
	checkError: function(name, check){
		this.setState({errorEvent: 'eventInput'})
		if (name === '' || !check) {
			this.setState({errorEvent: 'errorEvent'})
		}
	},
	checkArrayEvents: function(){
		var name = this.refs.addEventText.value;
		var events = this.props.events;
		var arrayLength = events.length;
		for (var i = 0; i < arrayLength; i++){
			if (events[i].name === name){
				return false
			}
		}
	},
	addEvent: function(e){
		e.preventDefault();
		var errorMaxEvents ="You can't add more than 4 events "
		if (this.props.events.length < 4){
			var name = this.refs.addEventText.value;
			var color = this.refs.colorValue.value;
			var errorMessage = "Please fill in an event name!"
			var errorSameValue ="There already is an event called"
			var check = this.checkArrayEvents()
			if (name !== '' && check !== false) {
				this.props.addEvent(name, color);
				this.updateAutocomplete();
				this.setState({errorMessage: null, name: null, errorEvent: 'eventInput'})
				
			} else {
				if (name === ''){
					this.setState({errorMessage: errorMessage})
					this.checkError(name);	
				} else {
					this.setState({errorMessage: errorSameValue, name: "'"+name+"'"})
					this.checkError(name, check)
				}
			}
		} else {
			this.setState({errorMessage: errorMaxEvents})
		}
		this.refs.form.reset();
	},
	deleteEvent: function(e,item){
		e.stopPropagation();
		var index = parseInt(item.split('$')[1].split('.')[0])
		this.props.deleteEvent(index)
		this.updateAutocomplete();
		this.setState({errorMessage: null})
	},
	event: function (event,index){
		var checkedClass = event.checked? "glyphicon glyphicon-check":"glyphicon glyphicon-unchecked"
		var color = {backgroundColor: event.color}
		return (
			<div 
				className="checkline"
				key={index}
			>
				<span className={checkedClass} index={index} onClick={this.handleClick}></span>{event.name}
				<i className="glyphicon glyphicon-remove checkremove" onClick={this.deleteEvent}></i>
				<div className="colorEvent" style={color}></div>
			</div>
		)
	},
	componentDidMount: function () {
		new jscolor($('.ownJsColor')[0],{position:'right',closable:true,valueElement:'valueColor',value:'7A54A8', hash:true})
	},
	render: function(){
		return (
			<div className="listenEvent">
				<div>
					<h3>Listen for events</h3>
				</div>
				<form ref="form" onSubmit={this.addEvent}>
					<div className="check">
						{this.props.events.map(this.event)}
					</div>
					<input className={this.state.errorEvent || 'eventInput'} type="text" ref="addEventText" placeholder="Event name" maxLength="25"/>
					<button className="ownJsColor">Pick a color</button>
					<p className="errorMessage">{this.state.errorMessage}</p>
					<p className="errorMessageName">{this.state.name}</p>
					<button className="button" type="button" onClick={this.addEvent}>Add event</button>
					<input type="hidden" id="valueColor" ref="colorValue"/>
				</form>
			</div>
		)
	}
})