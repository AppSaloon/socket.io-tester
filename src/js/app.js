'use-strict'

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import ui from 'jquery-ui';

// export for others scripts to use
window.$ = $;
window.jQuery = $;

import {SocketIOApp} from './components/socketUIWrapper';

render(
	<div>
		<SocketIOApp />
	</div>
	, document.getElementById('socketIOApp')
);

