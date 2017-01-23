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

    addColor (messages, event) {
        const color = event.color
        const coloredMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = coloredMessages.length; x < l; x++ )
            Object.assign(coloredMessages[x], {color, eventName: event.name})

        return coloredMessages
    }

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

    sortMessages (messages) {
        const sortedMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = sortedMessages.length - 1; x < l; x++ )
            for ( let y = x + 1, l = sortedMessages.length; y < l; y++ )
                if ( sortedMessages[x].timestamp < sortedMessages[y].timestamp )
                    [sortedMessages[x], sortedMessages[y]] = [sortedMessages[y], sortedMessages[x]]

        return sortedMessages
    }

    addScrollListener (element) {
        this.refElement = element
        element.addEventListener('scroll', this.handleScroll)
    }

    freezeAutoScroll () {
        if ( !this.state.autoScrollIsFrozen ) {
            this.setState({
                autoScrollIsFrozen: true
            })
        }
    }

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

    resumeAutoScroll (e) {
        this.scrollIsBusy = false
        this.oldestIsVisible = false
        this.setState({
            autoScrollIsFrozen: false
        }, this.getVisibleMessages)
    }

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
            for ( const index in sortedMessages )
                if ( sortedMessages[index].timestamp === currentlyVisible[0].timestamp ) {
                    const indexNum = parseInt(index)
                    const smallIndex = indexNum - 20 < 0 ? 0 : indexNum - 20
                    newVisibleMessages = [].concat(sortedMessages.slice(smallIndex, indexNum), currentlyVisible)
                    if ( parseInt(index) - 20 <= 0 )
                        this.newestIsVisible = true
                    if ( newVisibleMessages.length > 60 ) {
                        this.oldestIsVisible = false
                        newVisibleMessages = newVisibleMessages.slice(0, 60)
                    }
                }
        } else {
            for ( const index in sortedMessages )
                if ( sortedMessages[index].timestamp === currentlyVisible.slice(-1)[0].timestamp ) {
                    const indexNum = parseInt(index)
                    newVisibleMessages = [].concat(currentlyVisible, sortedMessages.slice(indexNum + 1, indexNum + 21))
                    if ( parseInt(index) + 21 > sortedMessages.length )
                        this.oldestIsVisible = true
                    if ( newVisibleMessages.length > 60 ) {
                        this.newestIsVisible = false
                        newVisibleMessages = newVisibleMessages.slice(-60)
                    }
                }
        }

        this.scrollIsBusy = false
        this.setState({
            visibleMessages: newVisibleMessages
        })
    }

    formatMessage (string) {
        let result
        try {
            result = JSON.parse(string)
        }
        catch (error) {
            result = string
        }
        return result
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
                {messages.map( (message) => {
                    const messageType = Object.prototype.toString.apply(message.message).slice(8, -1)
                    message.parsed = this.formatMessage(message.message)
                    message.isJson = Object.prototype.toString.apply(message.parsed).slice(8, -1) !== 'String' && messageType === 'String'
                    message.messageType = messageType
                    return(
                        <Message
                            key={message.timestamp}
                            message={message}
                        />
                    )
                }
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
