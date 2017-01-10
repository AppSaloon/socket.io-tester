import React, { Component } from 'react'

import Message from './Message'

class Messages extends Component {

    getVisibleMessages () {
        const id = this.props.activeTab
        const connections = this.props.connections
        const events = connections.list[connections.connections[id].index].events

        const visibleEvents = events.filter(event => event.visible)

        const mySentMessages = this.props.sentMessages.filter( m => m.socketId === id )
        const sentMessages = mySentMessages.map( m => Object.assign( {}, m, {right: true} ) )

        const allReceivedMessages = this.props.messages[id] || {}
        const messages = [].concat(sentMessages, ...visibleEvents.map(event => this.addColor(allReceivedMessages[event.name] || [], event) || []))

        const sortedMessages = this.sortMessages(messages)

        const messageSelection = sortedMessages.slice(0, 20)

        return messageSelection
    }

    addColor (messages, event) {
        const color = event.color
        const coloredMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = coloredMessages.length; x < l; x++ )
            Object.assign(coloredMessages[x], {color, eventName: event.name})

        return coloredMessages
    }

    sortMessages (messages) {
        const sortedMessages = messages.map(m => Object.assign({}, m))
        for ( let x = 0, l = sortedMessages.length - 1; x < l; x++ )
            for ( let y = x + 1, l = sortedMessages.length; y < l; y++ )
                if ( sortedMessages[x].timestamp < sortedMessages[y].timestamp )
                    [sortedMessages[x], sortedMessages[y]] = [sortedMessages[y], sortedMessages[x]]

        return sortedMessages
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
        const messages = this.getVisibleMessages()
        return (
            <div className="messages">
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
