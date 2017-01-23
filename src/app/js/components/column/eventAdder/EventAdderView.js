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

    getThisTab (props) {
        const connections = props.connections.connections
        const list = props.connections.list
        let activeTab = props.activeTab

        return list[connections[activeTab].index]
    }

    handleFormSubmit (e) {
        e.preventDefault()

        if ( !this.state.tab.connected )
            return

        const events = this.state.tab.events
        const newEventName = this.state.eventName
        if ( newEventName && !events.find( event => event.name === newEventName ) )
            this.props.addEvent(this.props.activeTab, {name: newEventName, visible: true, color: this.state.color})
    }

    handleCheckClick (name) {
        let event
        const events = this.state.tab.events
        for ( let x = 0, l = events.length; x < l; x++ )
            if ( events[x].name === name )
                event = events[x]

        this.props.toggleEventVisibility(this.props.activeTab, event.name)
    }

    toggleColorPicker (e) {
        e.preventDefault()
        const currentState = this.state.colorPickerVisible

        this.setState({
            colorPickerVisible: !currentState
        })

        const pos = e.target.getBoundingClientRect()
        const colorPickerUpdate = {
            visible: true,
            top: pos.top,
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

    addEvents () {
        document.addEventListener('click', this.handleDocumentClick)
        document.addEventListener('colorChange', this.handleColorChange)
    }

    removeEvents () {
        document.removeEventListener('click', this.handleDocumentClick)
        document.removeEventListener('colorChange', this.handleColorChange)
    }

    handleDocumentClick (e) {
        if ( !e.target.closest('.colorpicker') ) {
            this.setState({
                colorPickerVisible: false
            })
            this.props.setColorPicker({visible: false})
            this.removeEvents()
        }
    }

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
