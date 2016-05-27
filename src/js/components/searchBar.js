import React,{Component} from 'react';

export class SearchBar extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
    		value: props.selectedTab.url
    	}
    	this.changeUrl = this.changeUrl.bind(this);
    	this.enter = this.enter.bind(this);
    	this.refresh = this.refresh.bind(this);
	}
	changeUrl (e) {
		var val = this.refs.url.value;
		this.props.changeUrl(val);
	}
	enter (e) {
		if (e.key === 'Enter') {
			var url = this.refs.url.value;
			this.props.submitSocket(url);
		}
	}
	refresh (){
		var url = this.refs.url.value;
		this.props.refresh(url);
	}
	render (){
		return (
			<div id="searchContent" className="search">
				<i className="glyphicon glyphicon-repeat" onClick={this.refresh}></i>
				<div className="searchBar">
					<i className="glyphicon glyphicon-search"></i>
					<input 
						className="searchfield"
						type="text"
						ref='url'
						value={this.state.value} 
						onChange={this.changeUrl}
						onKeyPress={this.enter}
					/>
				</div>
			</div>
		)
	}
}