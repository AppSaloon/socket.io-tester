import React from 'react';

export const TabBar = React.createClass({
	selectTab: function (e,item) {
		var index = item.split('$')[1]
		this.props.selectTab(index);
	},
	deleteTab: function (e,item){
		e.stopPropagation();
		var index = parseInt(item.split('$')[1].split('.')[0])
		
		this.props.deleteTab(index);
	},
	tab: function (tab,index) {
		return (
			<div 
				onClick={this.selectTab} 
				index={index} 
				key={index} 
				className={tab.selected? 'tabselected':'tab'}
			>
				<p className={tab.selected? 'tabselectedText':'tabText'}>{(tab.url.length === 0)? 'New tab':tab.url} </p><i className="closeX fa fa-times" onClick={this.deleteTab}></i>
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