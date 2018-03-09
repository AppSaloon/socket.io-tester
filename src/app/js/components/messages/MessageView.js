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

        const state = {}

        if ( props.isSentMessage ) {
            state.messageType = props.message.type
            state.parsed = this.parseMessage(props.message.value, props.message.type)
            state.isJson = state.messageType === 'JSON'
            state.raw = props.message.value
        } else {
            const message = props.message
            state.messageType = Object.prototype.toString.apply(message).slice(8, -1)
            state.parsed = this.tryToParseJSONMessage(message)
            state.isJson = Object.prototype.toString.apply(state.parsed).slice(8, -1) !== 'String' && state.messageType === 'String'
            state.raw = props.message
        }

        this.state = {
            showRaw: false,
            ...state
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
    tryToParseJSONMessage (string) {
        let result
        try {
            result = JSON.parse(string)
        }
        catch (error) {
            result = string
        }
        return result
    }

    parseMessage (string, type) {
        console.log('parse', string, type)
        switch ( type ) {
            case 'String':
            return string

            case 'Array':
            case 'Object':
            let result
            eval(`result = ${string}`)
            return result

            case 'Number':
            return ~~string

            case 'JSON':
            return this.tryToParseJSONMessage(string)

            case 'Boolean':
            return string === 'true'

            default:
            return string
        }
    }

    toggleRaw (e) {
        this.setState({
            showRaw: !this.state.showRaw
        })
    }

    render () {
        const {isJson, parsed, messageType, raw} = this.state
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
