/**
 * EventListItem
 *
 * Renders one item in the list of subscribed events
 */

import React, { Component } from 'react'

import CheckIcon from '../../../icons/Check'
import UncheckedIcon from '../../../icons/Unchecked'
import RemoveIcon from '../../../icons/Remove'

class EventListItem extends Component {
    constructor (props) {
        super(props)

        this.state = {
            colorPickerVisible: false
        }

        this.toggleColorPicker = this.toggleColorPicker.bind(this)
        this.handleColorChange = this.handleColorChange.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
        this.handleRemoveClick = this.handleRemoveClick.bind(this)
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
            color: this.props.event.color
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
        this.props.changeEventColor(this.props.activeTab, this.props.event.name, color)
    }

    /**
     * Removes event and all of it's messages from the store
     */
    handleRemoveClick (e) {
        this.props.removeEvent(this.props.activeTab, this.props.event.name)
        this.props.removeMessages(this.props.activeTab, this.props.event.name)
    }

    render () {
        const {event, handleCheckClick} = this.props
        return (
            <div className="column-list-item">
                <span
                    className="column-list-item-icon"
                    onClick={e => handleCheckClick(event.name)}
                >
                    {
                        event.visible ?
                            <CheckIcon size={16} color={'#333'} />
                        :
                            <UncheckedIcon size={16} color={'#d8d8d8'} />
                    }
                </span>
                <span className="column-list-item-text">{event.name}</span>
                <span
                    className="column-list-item-icon"
                    onClick={this.handleRemoveClick}
                >
                    <RemoveIcon
                        color={'black'}
                        size={16}
                    />
                </span>
                <div
                    className="column-list-item-sidebar"
                    style={{backgroundColor: event.color}}
                    onClick={this.toggleColorPicker}
                ></div>
            </div>
        )
    }
}

export default EventListItem
