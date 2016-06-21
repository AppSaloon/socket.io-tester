import React from 'react';
import {TabBar} from './tabBar';
import {SearchBar} from './searchBar';
import {SendMessage} from './sendMessage';
import {ListenEvent} from './listenEvent';
import {RightSide} from './rightSide';

// import io from 'socket.io-client';

export var SocketIOApp = React.createClass({
	getInitialState : function () {
		var emptyTab = {
			url: '',
			selected: true,
			messages: [],
			events: [],
			webSocket: null,
			error: null
		}
		return {
			tabs : [emptyTab],
			slideClass: 'open'
		}
	},
	componentDidMount () {
		document.addEventListener(`colorChange`, this.eventListener);
	},
	componentWillUnmount () {
		document.removeEventListener(`colorChange`, this.eventListener);
	},
	eventListener (e) {
		const detail = e.detail;
		let tabs = this.state.tabs.slice();
		const tab = Object.assign({}, this.getSelectedTab());
		let events = tab.events.slice();
		events.forEach(function (event, i) {
			event = Object.assign({}, event);
			if ( event.name === detail.name ) {
				event.color = detail.newColor;
			}
			events[i] = event;
		});
		tab.events = events;
		tabs = tabs.map(function (origTab) {
			if ( origTab.url === tab.url ) {
				origTab = tab;
			}
			return origTab;
		});
		this.setState({
			tabs
		});
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
			events: [],
			webSocket: null,
			error: null
		}
		var tabs = this.state.tabs;
		// alle tabs uitzetten
		if (tabs.length < 7) {
			tabs = this.deSelectTabs(tabs);
			tabs.push(emptyTab);
		} else {
			alert("Maximum amount of tabs reached")
		}
		this.setState({
			tabs: tabs
		})
	},
	deleteTab: function(tabIndex){
		var tabs = this.state.tabs.slice(0); //Slice tabs Array with 0 to copy
		var tabWasSelected = tabs[tabIndex].selected === true;

		if (this.getSelectedTab().webSocket !== null) {
			this.getSelectedTab().webSocket.destroy()
		}
		tabs.splice(tabIndex, 1);

		if (tabs.length === 0) {
			tabs.push({
				url: '',
				selected: true,
				messages: [],
				events: [],
				webSocket: null,
				error: null
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

		this.emitMessage(newMessage);

		var tabs = this.state.tabs.map((tab,index) => {
			if (tab.selected){
				this.pushMessage(tab, newMessage);
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	emitMessage (message) {
		const socket = this.getSelectedTab().webSocket;
		socket.emit(message.event, message.message);
	},
	addEvent: function(name, color){
		var newEvent = {
			name: name,
			checked: true,
			color: color,
			hover: false
		}
		var tabs = this.state.tabs.map((tab,index) => {
			if(tab.selected){
				tab.events.push(newEvent)
				tab.webSocket.on(name, this.addSocketMessage.bind(this, name, tab.url));
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
		if ( Object.prototype.toString.apply(message).slice(8, -1) === 'Object' ) {
			message = JSON.stringify(message);
			type = 'Object';
		} else {
			try{
				var x = JSON.parse(message);
				type = 'Json';
			}
			catch(err){
				type = 'String';
			}
		}

		var color = this.addMessageColor(eventName);

		var newMessage = {
			event: eventName,
			type: type,
			message: message,
			author: 'Socket.IO',
			color: color
		}
		var tabs = this.state.tabs.map((tab,index) => {
			if (tab.url === url){
				this.pushMessage(tab, newMessage);
			}
			return tab
		})
		this.setState({
			tabs: tabs
		})
	},
	pushMessage (tab, message) {
		const messages = tab.messages.slice();
		if ( messages.length > 99 ) {
			messages.shift();
		}
		messages.push(message);
		tab.messages = messages;
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
	formatUrl (url) {
		const result = url.match(/^(https?:\/\/)/);
		// const result = url.match(/^(https?:\/\/)(?:\w+\.)?\w+(?:\.\w+)+\/?/);
		let newUrl;
		if ( !result ) {
			newUrl = 'http://'+url;
		}
		return newUrl || url;
	},
	submitSocket: function(url){
		url = this.formatUrl(url);
		var that = this;
		var tabs = this.state.tabs.slice();
		tabs = tabs.map(function(tab,index){
			if (tab.selected){
				if (tab.webSocket !== null){
					tab.webSocket.destroy()
					tab.webSocket = null
					tab.error = null;
				}
				var socket = io(url)
				tab.webSocket = socket
				if ( !tab.events.length ) {
					tab.events = [{}];
				}
				for(var i = 0; i < tab.events.length; i++){
					var eventName = tab.events[i].name;
					if ( eventName ) {
						socket.on(eventName, that.addSocketMessage.bind(that,eventName,tab.url))
					}
					socket.on('connect', function(){
						console.log("connect")
						tab.error = null;
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
						tab.error = null;
						that.setState({
							tabs: tabs
						})
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
	refresh: function(url, e){
		var that = this
		var tabs = this.state.tabs.map(function(tab,index){
			if (tab.selected){
				var socket = tab.webSocket
				if (socket === null) {
					var error = "Can not refresh when not connected to a socket"
					that.addError(tab.url, error, e)
				} else {
					socket.removeAllListeners();
					socket.destroy()
					tab.messages = [];
					tab.webSocket = null;
					that.submitSocket(url);
				}
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
		const selectedTab = this.getSelectedTab();
		return (
			<div className="main-container">
				<TabBar tabs={this.state.tabs} addTab={this.addTab} selectTab={this.selectTab} deleteTab={this.deleteTab}/>
				<SearchBar selectedTab={selectedTab} changeUrl={this.changeUrl} submitSocket={this.submitSocket} refresh={this.refresh} />
				{(selectedTab.webSocket)?
					<div className="content-container">
						<div className={"left " + this.state.slideClass}>
							<div className="scroller">
								<SendMessage addMessage={this.addMessage} changeEvent={this.changeEvent} events={selectedTab.events}/>
								<ListenEvent url={selectedTab.url} events={selectedTab.events} addEvent={this.addEvent} checkEvent={this.checkEvent} deleteEvent={this.deleteEvent} removeSocket={this.removeSocket} />
							</div>
							<div className="hideBar" onClick={this.slideLeftSide}></div>
						</div>
						<RightSide error={selectedTab.error} events={selectedTab.events} url={selectedTab.url} messages={this.getFilteredMessagesForTab()} />
					</div>
					:
					<div className="noConnectPage">
						<h1>Welcome to Chrome Socket.io tester</h1>
						<h2 style={{marginLeft: '30px'}}>Please enter a url in the search bar and</h2>
						<h2 style={{marginLeft: '220px', marginTop: '-10px'}}>press enter</h2>
					</div>
				}
			</div>
		)
	}
})