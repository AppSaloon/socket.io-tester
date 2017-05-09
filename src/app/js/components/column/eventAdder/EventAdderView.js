/**
 * EventAdder
 *
 * List of events
 * and input field for making new events
 */

import React, { Component } from 'react'

import EventsList from './EventsList'

class EventAdder extends Component {

    constructor (props) {
        super(props)

        const tab = this.getThisTab(props)

        this.state = {
            tab,
            eventName: '',
            colorPickerVisible: false,
            color: '#7a54a8'
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleCheckClick = this.handleCheckClick.bind(this)
        this.toggleColorPicker = this.toggleColorPicker.bind(this)
        this.handleColorChange = this.handleColorChange.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tab: this.getThisTab(nextProps)
        })
    }

    /**
     * Returns active tab
     * 
     * @param {Object} props
     * 
     * @return {Object}
     */
    getThisTab (props) {
        const connections = props.connections.connections
        const list = props.connections.list
        let activeTab = props.activeTab

        return list[connections[activeTab].index]
    }

    /**
     * Add new 'event' to redux store
     */
    handleFormSubmit (e) {
        e.preventDefault()

        if ( !this.state.tab.connected )
            return

        const events = this.state.tab.events
        const newEventName = this.state.eventName
        if ( newEventName && !events.find( event => event.name === newEventName ) )
            this.props.addEvent(this.props.activeTab, {name: newEventName, visible: true, color: this.state.color})
    }

    /**
     * Toggles an event's messages visibility
     * 
     * @param {String} name eventname
     */
    handleCheckClick (name) {
        let event
        const events = this.state.tab.events
        for ( let x = 0, l = events.length; x < l; x++ )
            if ( events[x].name === name )
                event = events[x]

        this.props.toggleEventVisibility(this.props.activeTab, event.name)
    }

    /**
     * Show or hide the colorpicker by updating the 'visible' status in the store
     */
    toggleColorPicker (e) {
        e.preventDefault()
        const currentState = this.state.colorPickerVisible

        this.setState({
            colorPickerVisible: !currentState
        })

        const pos = e.target.getBoundingClientRect()
        let colorPickerPosition = pos.top
        // if colorpicker height + position + 10px > window height
        if ( 241.75 + pos.top + 10 > window.innerHeight ) {
            colorPickerPosition = window.innerHeight - 10 - 241.75
        }
        const colorPickerUpdate = {
            visible: true,
            top: colorPickerPosition,
            color: this.state.color
        }

        if ( currentState )
            colorPickerUpdate.visible = false

        setTimeout(() => {
            this.props.setColorPicker(colorPickerUpdate)
        }, 1)

        if ( currentState )
            this.removeEvents()
        else
            this.addEvents()
    }

    /**
     * Add events to catch color change and when colorpicker should be closed
     */
    addEvents () {
        document.addEventListener('click', this.handleDocumentClick)
        document.addEventListener('colorChange', this.handleColorChange)
    }

    /**
     * Remove eventlisteners added in addEvents()
     */
    removeEvents () {
        document.removeEventListener('click', this.handleDocumentClick)
        document.removeEventListener('colorChange', this.handleColorChange)
    }

    /**
     * Closes colorpicker is user clicked outside of the colorpicker element
     */
    handleDocumentClick (e) {
        if ( !e.target.closest('.colorpicker') ) {
            this.setState({
                colorPickerVisible: false
            })
            this.props.setColorPicker({visible: false})
            this.removeEvents()
        }
    }

    /**
     * Update color after a new color was selected in the colorpicker
     */
    handleColorChange ({detail: {rgba: color}}) {
        this.setState({
            color
        })
    }

    render () {
        const tab = this.state.tab
        const connected = tab.connected
        return (
            <div className="column-block">
                <h3 className="column-title">Listen for events</h3>
                <EventsList
                    setColorPicker={this.props.setColorPicker}
                    activeTab={this.props.activeTab}
                    events={tab.events}
                    removeEvent={this.props.removeEvent}
                    removeMessages={this.props.removeMessages}
                    handleCheckClick={this.handleCheckClick}
                    changeEventColor={this.props.changeEventColor}
                />
                <form className="column-block-form" onSubmit={this.handleFormSubmit}>
                    <div className="column-block-group">
                        <input
                            className="column-block-input column-block-input-group"
                            placeholder="Event name"
                            value={this.state.eventName}
                            onChange={e => this.setState({eventName: e.target.value})}
                        />
                        <input
                            type="button"
                            value="Pick a color"
                            className="column-button column-block-button-group"
                            style={{backgroundColor: this.state.color}}
                            onClick={this.toggleColorPicker}
                        />
                    </div>
                    <input
                        className="column-button column-form-button"
                        type="submit"
                        value="Add event"
                        disabled={!connected}
                    />
                </form>
            </div>
        )
    }
}

export default EventAdder
