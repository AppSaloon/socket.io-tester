/**
 * EventsList
 *
 * Renders the list of events
 *
 * @property {Number} activeTab
 * @property {Array} events
 * @property {Function} changeEventColor
 * @property {Function} handleCheckClick
 * @property {Function} removeEvent
 * @property {Function} removeMessages
 * @property {Function} setColorPicker
 */

import React from 'react'

import EventListItem from './EventListItem'

const EventsList = ({events, handleCheckClick, activeTab, changeEventColor, removeEvent, removeMessages, setColorPicker}) =>
    <div className="column-list">
        {events.map(e =>
            <EventListItem
                activeTab={activeTab}
                key={e.name}
                event={e}
                removeEvent={removeEvent}
                removeMessages={removeMessages}
                handleCheckClick={handleCheckClick}
                changeEventColor={changeEventColor}
                setColorPicker={setColorPicker}
            />
        )}
    </div>

export default EventsList
