import React from 'react';
import ColorPicker from 'react-color-picker';
import {ListenForm} from './listenForm';

export var ListenEvent = React.createClass({
	render: function(){
		return (
			<div className="listenEvent">
				<div>
					<h3>Listen for events</h3>
				</div>
				<div className="check">
					{this.props.events.map((event,index) => {
						if ( event.name ) {
							return (
								<EventItem url={this.props.url} key={index} checkEvent={this.props.checkEvent} deleteEvent={this.props.deleteEvent} event={Object.assign({}, event)} index={index} />
							)
						}
					})}
				</div>
				<ListenForm events={this.props.events} addEvent={this.props.addEvent} />
			</div>
		)
	}
})

var EventItem = React.createClass({
	getInitialState: function(){
		return {
			showRemove: false,
			hideColorPicker: 'none',
			color : this.props.event.color
		}
	},
	componentWillReceiveProps (newProps) {
		if ( this.state.color !== newProps.event.color ) {
			this.setState({
				color: newProps.event.color
			});
		}
	},
	handleClick: function(index){
		this.props.checkEvent(index)
	},
	deleteEvent: function(index, e){
		e.stopPropagation();
		this.props.deleteEvent(index)
		this.setState({errorMessage: null})
	},
	onDrag: function(color){
		this.props.event.color = color;
		this.setState({
			color: color
		})
	},
	eventListener (e) {
		const path = e.path;
		let className,
			eventIsInsideColorPicker = false;
		path.forEach(function(a){
			className = a.className || '';
			if ( className.match('colorPickerContainer') ) {
				eventIsInsideColorPicker = true;
			}
		});
		if ( !eventIsInsideColorPicker ) {
			document.removeEventListener(`click`, this.eventListener);
			this.setState({
				hideColorPicker: 'none'
			});
		}
	},
	toggleColorPicker: function(e){
		if(this.state.hideColorPicker === 'none') {
			document.addEventListener(`click`, this.eventListener);
			this.setState({
				hideColorPicker: 'block'
			})
		} else {
			this.setState({
				hideColorPicker: 'none'
			})
		}
	},
	handleOnColorChange (newColor) {
		document.dispatchEvent(new CustomEvent(`colorChange`, {detail: {newColor, name: this.props.event.name}}));
	},
	render: function () {
		var checkedClass = this.props.event.checked? "glyphicon glyphicon-check":"glyphicon glyphicon-unchecked"
		var color = {backgroundColor: this.state.color};

		return (
			<div className="checkline">
				<span className={checkedClass}  onClick={this.handleClick.bind(this, this.props.index)}></span>
				<span style={(this.props.event.checked)? null:{checkColor: '#D8D5DB'}}>{this.props.event.name}</span>
				<i className="glyphicon glyphicon-remove checkremove" onClick={this.deleteEvent.bind(this, this.props.index)}></i>
				<div className="colorEvent" style={color} onClick={this.toggleColorPicker}>
					<div className="colorPickerContainerBorder" style={{display: this.state.hideColorPicker}}>
					<div className="colorPickerContainer" >
						<ColorPicker
							saturationWidth={200}
							saturationHeight={200}
							value={this.state.color}
							onDrag={this.onDrag}
							onChange={this.handleOnColorChange}
						/>
					</div>
				</div>
				</div>
			</div>
		)
	}
})