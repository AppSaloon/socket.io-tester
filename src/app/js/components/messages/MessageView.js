/**
 * MessageViewer
 *
 * Displays the content of the message
 * 
 * @property {Object} message
 */

import React, { Component } from 'react'
import { ObjectInspector } from 'react-inspector'

class MessageViewer extends Component {
    constructor (props) {
        super(props)

        const message = props.message
        const messageType = Object.prototype.toString.apply(message).slice(8, -1)
        const parsed = this.formatMessage(message)
        const isJson = Object.prototype.toString.apply(parsed).slice(8, -1) !== 'String' && messageType === 'String'

        this.state = {
            showRaw: false,
            messageType,
            parsed,
            isJson
        }

        this.toggleRaw = this.toggleRaw.bind(this)
    }

    /**
     * Attempts to parse a JSON string and returns the result
     * 
     * @param {String} string JSON string
     * 
     * @return {Object or String} parsed JSON or original string of invalid
     */
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

    toggleRaw (e) {
        this.setState({
            showRaw: !this.state.showRaw
        })
    }

    render () {
        const {isJson, parsed, messageType} = this.state
        const raw = this.props.message
        const showRaw = this.state.showRaw
        return (
            <div className="message-preview">
                <hr />
                <div className="message-preview-title">
                    <span>Argument&nbsp;</span>
                    <span>{this.props.index + 1}</span>
                </div>
                <div className="message-text">
                    <span className="message-text-title">Type:</span>
                    <span className="message-text-content">{isJson ? 'JSON' : messageType}</span>
                </div>
                <div className="message-text">
                    <span className="message-text-title">Message:</span>
                    <button
                        onClick={this.toggleRaw}
                        className={`message-preview-toggle ${ isJson ? '' : 'hidden' }`}
                    >
                        {showRaw ? "show pretty" : "show raw"}
                    </button>
                </div>
                <ObjectInspector
                    data={showRaw ? raw : parsed}
                />
            </div>
        )
    }
}

export default MessageViewer
