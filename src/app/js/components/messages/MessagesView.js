/**
 * Messages
 *
 * View that displays all received and sent messages
 *
 * @property {Number} activeTab id of active tab
 * @property {Object} connections all socket.io connections
 * @property {Object} messages all received messages
 * @property {Array} sentMessages array of all sent messages
 * @property {Function} deleteAllMessages
 * @property {Function} deleteAllSentMessages
 */

import React, { Component } from 'react'

import Message from './Message'

class Messages extends Component {

    constructor (props) {
        super(props)

        this.state = {
            visibleMessages : [],
            autoScrollIsFrozen: false
        }

        this.oldestIsVisible = false
        this.newestIsVisible = true
        this.scrollIsBusy = false

        this.addScrollListener = this.addScrollListener.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.resumeAutoScroll = this.resumeAutoScroll.bind(this)
        this.showMoreMessages = this.showMoreMessages.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.newestIsVisible = false
        this.getVisibleMessages(nextProps)
    }

    /**
     * Gets all messages that should be displayed and sets them to the state
     * 
     * @param {Object} props
     */
    getVisibleMessages (props=this.props) {
        if ( this.state.autoScrollIsFrozen )
            return

        const groupedMessages = this.getGroupedMessages(props)

        const sortedMessages = this.sortMessages(groupedMessages)

        const messageSelection = sortedMessages.slice(0, 20)

        this.setState({
            visibleMessages: messageSelection
        })
    }

    /**
     * Attaches appropriate color to message objects
     * 
     * @param {Array} messages
     * @param {Object} event event object with eventname and color
     *
     * @return {Array} an array with the modified messages
     */
    addColor (messages, event) {
        const color = event.color
        const coloredMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = coloredMessages.length; x < l; x++ )
            Object.assign(coloredMessages[x], {color, eventName: event.name})

        return coloredMessages
    }

    /**
     * Returns a combined list of received and sent messages that should be displayed
     * 
     * @param {Object} props
     * 
     * @return {Array} an array of messages
     */
    getGroupedMessages (props=this.props) {
        const id = props.activeTab
        const connections = props.connections
        const events = connections.list[connections.connections[id].index].events

        const visibleEvents = events.filter(event => event.visible)

        const mySentMessages = props.sentMessages.filter( m => m.socketId === id )
        const sentMessages = mySentMessages.map( m => Object.assign( {}, m, {right: true} ) )

        const allReceivedMessages = props.messages[id] || {}
        const messages = [].concat(sentMessages, ...visibleEvents.map(event => this.addColor(allReceivedMessages[event.name] || [], event) || []))

        return messages

    }

    /**
     * Returns a sorted list of messages based on timestamp
     * 
     * @param {Array} messages
     * 
     * @return {Array} an array of sorted messages
     */
    sortMessages (messages) {
        const sortedMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = sortedMessages.length - 1; x < l; x++ )
            for ( let y = x + 1, l = sortedMessages.length; y < l; y++ )
                if ( sortedMessages[x].timestamp < sortedMessages[y].timestamp )
                    [sortedMessages[x], sortedMessages[y]] = [sortedMessages[y], sortedMessages[x]]

        return sortedMessages
    }

    /**
     * Adds a scroll eventlistener to specified element
     * 
     * @param {HTMLElement} element
     */
    addScrollListener (element) {
        this.refElement = element
        element.addEventListener('scroll', this.handleScroll)
    }

    /**
     * Sets autoScrollIsFrozen to true if it isn't already
     */
    freezeAutoScroll () {
        if ( !this.state.autoScrollIsFrozen ) {
            this.setState({
                autoScrollIsFrozen: true
            })
        }
    }

    /**
     * Handles scroll event and makes messages scroll as a result
     */
    handleScroll (e) {
        if ( this.scrollIsBusy )
            return

        const scrollTop = e.target.scrollTop

        this.freezeAutoScroll()
        this.newestIsVisible = false

        const viewHeight = this.refElement.clientHeight
        const scrollHeight = this.refElement.scrollHeight
        if ( scrollTop + viewHeight + (viewHeight/2) > scrollHeight ) {
            this.scrollIsBusy = true
            this.showMoreMessages('bottom')
        }
    }

    /**
     * Re-enables autoscroll
     */
    resumeAutoScroll (e) {
        this.scrollIsBusy = false
        this.oldestIsVisible = false
        this.setState({
            autoScrollIsFrozen: false
        }, this.getVisibleMessages)
    }

    /**
     * Updates visibleMessages based on position
     * 
     * @param {String} position where new messages need to be loaded, can be top or bottom
     */
    showMoreMessages (position) {
        if ( position === 'top' && this.newestIsVisible )
            return
        else if ( position === 'bottom' && this.oldestIsVisible )
            return

        const groupedMessages = this.getGroupedMessages()
        const sortedMessages = this.sortMessages(groupedMessages)

        const currentlyVisible = this.state.visibleMessages
        let newVisibleMessages

        if ( position === 'top' ) {
            newVisibleMessages = this.getNextMessages(sortedMessages, currentlyVisible)
        } else {
            newVisibleMessages = this.getPreviousMessages(sortedMessages, currentlyVisible)
        }

        this.scrollIsBusy = false
        this.setState({
            visibleMessages: newVisibleMessages
        })
    }

    /**
     * Returns an array of new messages that should be added to the list of visible messages
     * 
     * @param  {Array} sortedMessages
     * @param  {Array} currentlyVisible
     * 
     * @return {Array}
     */
    getNextMessages (sortedMessages, currentlyVisible) {
        let newVisibleMessages

        for ( const index in sortedMessages )
            if ( sortedMessages[index].timestamp === currentlyVisible[0].timestamp ) {
                const indexNum = parseInt(index, 10)
                const smallIndex = indexNum - 20 < 0 ? 0 : indexNum - 20
                newVisibleMessages = [].concat(sortedMessages.slice(smallIndex, indexNum), currentlyVisible)
                if ( parseInt(index, 10) - 20 <= 0 )
                    this.newestIsVisible = true
                if ( newVisibleMessages.length > 60 ) {
                    this.oldestIsVisible = false
                    newVisibleMessages = newVisibleMessages.slice(0, 60)
                }
            }

        return newVisibleMessages
    }

    /**
     * Returns an array of older messages that should be added to the list of visible messages
     * 
     * @param  {Array} sortedMessages
     * @param  {Array} currentlyVisible
     * 
     * @return {Array}
     */
    getPreviousMessages (sortedMessages, currentlyVisible) {
        let newVisibleMessages

        for ( const index in sortedMessages )
            if ( sortedMessages[index].timestamp === currentlyVisible.slice(-1)[0].timestamp ) {
                const indexNum = parseInt(index, 10)
                newVisibleMessages = [].concat(currentlyVisible, sortedMessages.slice(indexNum + 1, indexNum + 21))
                if ( parseInt(index, 10) + 21 > sortedMessages.length )
                    this.oldestIsVisible = true
                if ( newVisibleMessages.length > 60 ) {
                    this.newestIsVisible = false
                    newVisibleMessages = newVisibleMessages.slice(-60)
                }
            }

        return newVisibleMessages
    }

    render () {
        const messages = this.state.visibleMessages
        return (
            <div className="messages" ref={ this.addScrollListener }>
                <TopButtons
                    frozen={this.state.autoScrollIsFrozen}
                    resumeAutoScroll={this.resumeAutoScroll}
                    showMoreMessages={this.showMoreMessages}
                />
                {messages.map( message =>
                    <Message
                        key={message.timestamp}
                        message={message}
                    />
                )}
                <RemoveButton deleteMessages={ e => {this.props.deleteAllMessages(); this.props.deleteAllSentMessages()} } />
            </div>
        )
    }
}

export default Messages

const RemoveButton = ({deleteMessages}) =>
    <span
        onClick={deleteMessages}
        className="message-remove-all-button"
    >
        Delete all messages
    </span>

class TopButtons extends Component {
    render () {
        const { frozen, resumeAutoScroll, showMoreMessages } = this.props
        return (
            <div className={`${ frozen ? '' : 'hidden' } messages-top-buttons`}>
                <span>Autoscroll paused</span>
                <span
                    className="messages-top-buttons-button"
                    onClick={resumeAutoScroll}
                >
                    Click to resume
                </span>
                <span className="messages-top-buttons-spacer"></span>
                <span
                    className="messages-top-buttons-button"
                    onClick={() => showMoreMessages('top') }
                >
                    Click to load 20
                </span>
            </div>
        )
    }
}
