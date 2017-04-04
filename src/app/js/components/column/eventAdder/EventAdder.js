/**
 * EventAdder
 *
 * EventAdderView connector
 */

import { connect } from 'react-redux'

import EventAdderView from './EventAdderView'

function mapStateToProps (state) {
    const list = state.connections.list.filter(c => !c.disabled)
    let activeTab = state.activeTab
    if ( activeTab === -1 )
        activeTab = list.slice(-1)[0].id
    return {
        connections: state.connections,
        activeTab
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addEvent (id, event) {
            dispatch({
                type: 'ADD_EVENT',
                id,
                event
            })
        },
        removeEvent (id, eventName) {
            dispatch({
                type: 'REMOVE_EVENT',
                id,
                eventName
            })
        },
        toggleEventVisibility (id, eventName) {
            dispatch({
                type: 'TOGGLE_EVENT_VISIBILITY',
                id,
                eventName
            })
        },
        changeEventColor (id, eventName, color) {
            dispatch({
                type: 'SET_EVENT_COLOR',
                id,
                eventName,
                color
            })
        },
        removeMessages (id, eventName) {
            dispatch({
                type: 'REMOVE_MESSAGES',
                id,
                eventName
            })
        },
        setColorPicker (state) {
            dispatch({
                type: 'UPDATE_COLORPICKER',
                state
            })
        }
    }
}

const EventAdder = connect(mapStateToProps, mapDispatchToProps)(EventAdderView)

export default EventAdder
