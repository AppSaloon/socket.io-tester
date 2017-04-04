/**
 * Column
 *
 * Renders message editor and event list
 */

import React, { Component } from 'react'

import MessageSender from './messageSender/MessageSender'
import EventAdder from './eventAdder/EventAdder'

const Column = () =>
    <div className="column">
        <MessageSender />
        <EventAdder />
    </div>

export default Column
