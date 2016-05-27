import React from 'react';
import {TabBar} from './tabBar';
import {SearchBar} from './searchBar';
import {SendMessage} from './sendMessage';
import {ListenEvent} from './listenEvent';
import {RightSide} from './rightSide';
import io from 'socket.io-client'

export var SocketIOApp = React.createClass({
	getInitialState : function () {
		var emptyTab = {
			url: 'localhost:3150',
			selected: true,
			messages: [],
			events: [
				{
					name: 'chat message',
					checked : true,
					color: 'blue'
				},{
					name: 'test', 
					checked: false,
					color: 'red'
				}
			],
			webSocket: null,
			error: null
		}
		return {
			tabs : [emptyTab]
		}
	},
	selectTab: function(i){
		var tabs = this.state.tabs;
		tabs = this.deSelectTabs(tabs);
		tabs[i].selected = true;
		this.setState({
			tabs: tabs
		})
	},
	deSelectTabs : function (tabs) {
		return tabs.map(function (tab) {
			tab.selected = false;
			return tab
		})
	},
	addTab: function() {
		var emptyTab = {
			url: '',
			selected: true,
			messages: [],
			events: [
				{
					name: 'chat message',
					checked : true,
					color: 'blue'
				},{
					name: 'test', 
					checked: false,
					color: 'red'
				}
			],
			webSocket: null,
			error: null
		}
		var tabs = this.state.tabs;
		// alle tabs uitzetten
		tabs = this.deSelectTabs(tabs);
		tabs.push(emptyTab);
		this.setState({
			tabs: tabs
		})
	},
	deleteTab: function(tabIndex){
		var tabs = this.state.tabs.slice(0); //Slice tabs Array with 0 to copy
		var tabWasSelected = tabs[tabIndex].selected === true;

		tabs.splice(tabIndex, 1);

		if (tabs.length === 0) {
			tabs.push({
				url: '',
				selected: true
			});
		}

		if (tabWasSelected) {
			if (tabs[tabIndex]) {
				tabs[tabIndex].selected = true;
			} else {
				tabs[tabIndex-1].selected = true;
			}
			
		}

		this.setState({
			tabs: tabs
		})
	},
	getSelectedTab: function(){
		return this.state.tabs.find(function (tab) {
			return tab.selected
		})
	},
	changeUrl: function (value) {
		var tabs = this.state.tabs.map(function (tab) {
			if (tab.selected) {
				tab.url = value;
			}
			return tab
		})

		this.setState({
			tabs : tabs
		})
	},
	changeEvent: function (value) {
		var tabs = this.state.tabs.map(function (tab) {
			if (tab.selected) {
				tab.messages.event = value;
			}
			return tab
		})

		this.setState({
			tabs : tabs
		})
	},
	addMessage: function(event, message, type) {
		try{
			var x = JSON.parse(message);
			type = 'Json';
		}
		catch(err){
			type = 'String';
		}

		var color = this.addMessageColor(event);

		var newMessage = {
			event: event,
			type: type,
			message: message,
			author: 'Me',
			color: color
		}

		var tabs = this.state.tabs.map(function(tab,index){
			if (tab.selected){
				tab.messages.push(newMessage)
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	addEvent: function(name, color){
		var newEvent = {
			name: name,
			checked: true,
			color: color,
		}
		var tabs = this.state.tabs.map(function(tab,index){
			if(tab.selected){
				tab.events.push(newEvent)		
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	checkEvent: function (i) {
		var tabs = this.state.tabs.map(function(tab,index){
			if(tab.selected){
				tab.events[i].checked = !tab.events[i].checked;
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	deleteEvent: function(i){
		var that = this
		var tabs = this.state.tabs.map(function(tab,index){
			if(tab.selected){
				var eventName = tab.events[i].name
				var socket = tab.webSocket
				socket.off(eventName);
				that.deleteSocketMessage(eventName);
				tab.events.splice(i,1);
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	deleteSocketMessage: function(eventName){
		var tabs = this.state.tabs.map(function(tab,index){
			if(tab.selected){
				tab.messages = tab.messages.filter(function(message){
					return message.event !== eventName
				})
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	addMessageColor: function(eventName){
		var color = null
		var tabs = this.state.tabs.map(function(tab,index){
			if (tab.selected){
				tab.events.map(function(event,index){
					if (eventName === event.name) {
						color = event.color
					}
				})
			}
		})
		return color
	},
	addSocketMessage: function(eventName, url, message, type){
		try{
			var x = JSON.parse(message);
			type = 'Json';
		}
		catch(err){
			type = 'String';
		}

		var color = this.addMessageColor(eventName);

		var newMessage = {
			event: eventName,
			type: type,
			message: message,
			author: 'Socket.IO',
			color: color
		}
		var tabs = this.state.tabs.map(function(tab,index){
			if (tab.url === url){
				tab.messages.push(newMessage)
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	addError: function(url, error, e){
		var tabs = this.state.tabs.map(function(tab,index){
			if (url === tab.url) {
				tab.error = error
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	submitSocket: function(url){
		var that = this;
		var tabs = this.state.tabs.slice();
		tabs = tabs.map(function(tab,index){
			if (tab.selected){
				if (tab.webSocket !== null){
					tab.webSocket.destroy()
				}
				var socket = io(url)
				for(var i = 0; i < tab.events.length; i++){
					var eventName = tab.events[i].name
					socket.on(eventName, that.addSocketMessage.bind(that,eventName,tab.url))
					socket.on('connect', function(){
						console.log("connect")
						tab.webSocket = socket
						that.setState({
							tabs: tabs
						})
					})
					socket.on('connect_error', function(e){
						var error = "No sockets found"
						that.addError(tab.url, error, e);
						console.log("connect error")
					})
					socket.on('connect_timeout', function(e){
						var error = "Connection timeout"
						that.addError(tab.url, error, e);
						console.log("connect timeout")	
					})
					socket.on('reconnect', function(){
						console.log("reconnect")
					})
					socket.on('reconnect_attempt', function(){
						console.log("reconnect attempt")
					})
					socket.on('reconnecting', function(){
						console.log("reconnecting")
					})
					socket.on('reconnect_error', function(e){
						var error = "An error occurred while reconnecting"
						that.addError(tab.url, error, e);
						console.log("reconnect error")
					})
					socket.on('reconnect_failed', function(e){
						var error = "failed to reconnect"
						that.addError(tab.url, error, e);
						console.log("reconnect failed")
					})
				}
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	getFilteredMessagesForTab: function () {
		var selectedTab = this.getSelectedTab()
		var messages = selectedTab.messages;
		var events = selectedTab.events;
		var filterdMessageList = messages.filter(function (message, index, list) {
			var keep = false;
			events.forEach(function (event, index, list) {
				if (event.name === message.event && event.checked) {
					keep = true
				}
			})
			return keep
		})
		return filterdMessageList;
	},
	refresh: function(url){
		var that = this
		var tabs = this.state.tabs.map(function(tab,index){
			if (tab.selected){
				var socket = tab.webSocket
				socket.removeAllListeners();
				socket.destroy()
				tab.messages = [];
				tab.webSocket = null;
				that.submitSocket(url);
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	slideLeftSide: function(){
		if (this.state.slideClass === "close") {
			this.setState({slideClass: "open"})
		} else {
			this.setState({slideClass: "close"})
		}
	},
	render: function () {
		return (
			<div>
				<TabBar tabs={this.state.tabs} addTab={this.addTab} selectTab={this.selectTab} deleteTab={this.deleteTab}/>
				<SearchBar selectedTab={this.getSelectedTab()} changeUrl={this.changeUrl} submitSocket={this.submitSocket} refresh={this.refresh} />
				{(this.getSelectedTab().webSocket)?
					<div>
						<div className={"left " + this.state.slideClass}>
							<SendMessage addMessage={this.addMessage} selectedTab={this.getSelectedTab()} changeEvent={this.changeEvent} events={this.getSelectedTab().events}/>
							<ListenEvent events={this.getSelectedTab().events} addEvent={this.addEvent} checkEvent={this.checkEvent} deleteEvent={this.deleteEvent} removeSocket={this.removeSocket} />
							<div className="hideBar" onClick={this.slideLeftSide}></div>
						</div>
						<RightSide messages={this.getFilteredMessagesForTab()} />
					</div>
					:
					<div className="noConnectPage">
						<h1>Welcome to Chrome Socket.io tester</h1>
						{(this.getSelectedTab().error)?
							<div className="error">
								<h3><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> {this.getSelectedTab().error}</h3>
							</div>
							:
							null
						}
					</div>
				}
			</div>
		)
	}
})