import React from 'react';

export var SearchBar = React.createClass({
	componentDidMount() {
	    document.getElementById('searchField').focus()
	},
	changeUrl: function() {
		var val = this.refs.url.value;
		this.props.changeUrl(val);
	},
	enter: function(e) {
		if (e.key === 'Enter') {
			var url = this.refs.url.value;
			this.props.submitSocket(url);
		}
	},
	refresh: function(){
		var url = this.refs.url.value;
		this.props.refresh(url);
	},
	render: function(){
		return (
			<div id="searchContent" className="search">
				<i className="glyphicon glyphicon-repeat" style={(this.props.selectedTab.webSocket === null)?{color:"#E6E6E6", opacity:"0.2"}: null} onClick={(this.props.selectedTab.webSocket !== null)? this.refresh: null}></i>
				<div className="searchBar">
					<i className={(this.props.selectedTab.webSocket === null)?"glyphicon glyphicon-search": "fa fa-rss"}></i>
					<input 
						className="searchfield"
						id="searchField"
						type="text"
						ref='url'
						value={this.props.selectedTab.url} 
						onChange={this.changeUrl}
						onKeyPress={this.enter}
					/>
				</div>
			</div>
		)
	}
})