import React from 'react';
import ColorPicker from 'react-color-picker';

export var ListenForm = React.createClass({
	getInitialState: function(){
		return {
			errorEvent: 'eventInput',
			hideColorPicker: 'none',
			color: '#7A54A8'
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
	checkError: function(name, check){
		this.setState({errorEvent: 'eventInput'})
		if (name === '' || !check) {
			this.setState({errorEvent: 'errorEvent'})
		}
	},
	addEvent: function(e){
		e.preventDefault();
		var name = this.refs.addEventText.value;
		var color = this.state.color
		var errorMessage = "Please fill in an event name!"
		var errorSameValue ="There already is an event called"
		var check = this.checkArrayEvents()
		if (name !== '' && check !== false) {
			this.props.addEvent(name, color);
			if (this.state.hideColorPicker !== 'none'){ 
				this.toggleColorPicker();
			}
			this.setState({
				errorMessage: null,
				name: null,
				errorEvent: 'eventInput',
				color: '#7A54A8',
				buttonColorText: 'white'
			})
		} else {
			if (name === ''){
				this.setState({errorMessage: errorMessage})
				this.checkError(name);	
			} else {
				this.setState({errorMessage: errorSameValue, name: "'"+name+"'"})
				this.checkError(name, check)
			}
		}
		this.refs.form.reset();
	},
	toggleColorPicker: function(){
		if(this.state.hideColorPicker === 'none') {
			this.setState({
				hideColorPicker: 'inline'
			})
		} else {
			this.setState({
				hideColorPicker: 'none'
			})
		}
	},
	changeColorButtonText: function() {
		var hexcolor = this.state.color.substr(1)
		var r = parseInt(hexcolor.substr(0,2),16);
	    var g = parseInt(hexcolor.substr(2,2),16);
	    var b = parseInt(hexcolor.substr(4,2),16);
	    var yiq = ((r*299)+(g*587)+(b*114))/1000;
	    if(yiq >= 128) {
	    	this.setState({
	    		buttonColorText: 'black'
	    	})
	    } else {
	    	this.setState({
	    		buttonColorText: 'white'
	    	})
	    }
	},
	onDrag: function(color){
		this.changeColorButtonText()
        this.setState({color: color})
    },
	render: function() {
		return (
			<form ref="form" onSubmit={this.addEvent}>
				<input className={this.state.errorEvent} type="text" ref="addEventText" placeholder="Event name" maxLength="25"/>
				<button type="button" className="colorPickerButton" style={{backgroundColor: this.state.color}} onClick={this.toggleColorPicker}>
					<span style={{color: this.state.buttonColorText}}>Pick a color</span>
				</button>
				<div className="colorPickerContainerBorder" style={{display: this.state.hideColorPicker}}>
					<div className="colorPickerContainer" >
						<ColorPicker saturationWidth={200} saturationHeight={200} value={this.state.color} onDrag={this.onDrag}/>
					</div>
				</div>
				<p className="errorMessage">{this.state.errorMessage}</p>
				<p className="errorMessageName">{this.state.name}</p>
				<button className="button" type="button" onClick={this.addEvent}>Add event</button>
			</form>
		)
	}
})