import React from 'react';

export var TabBar = React.createClass({
	selectTab: function (index) {
		this.props.selectTab(index);
	},
	deleteTab: function (index, e){
		e.stopPropagation();
		this.props.deleteTab(index);
	},
	tab: function (tab,index) {
		return (
			<div 
				onClick={this.selectTab.bind(this, index)} 
				index={index} 
				key={index} 
				className={tab.selected? 'tabselected':'tab'}
			>
				<p className={tab.selected? 'tabselectedText':'tabText'}>{(tab.url.length === 0)? 'New tab':tab.url} </p><i className="closeX fa fa-times" onClick={this.deleteTab.bind(this, index)}></i>
			</div>
		)
	},
	render: function(){
		return (
			<header className="header">
				{this.props.tabs.map(this.tab)}
				<span onClick={this.props.addTab} className="fa fa-plus-square"></span>
			</header>
		)
	}
})