'use-strict'

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import ui from 'jquery-ui';

var service = analytics.getService('socket.io-tester');
var tracker = service.getTracker('UA-26253416-7');
tracker.sendEvent('App v1 beta (0.1.0) starting');

// export for others scripts to use
window.$ = $;
window.jQuery = $;

import {SocketIOApp} from './components/socketUIWrapper';

render(
	<div className="app">
		<SocketIOApp />
	</div>
	, document.getElementById('socketIOApp')
);

