import React, { Component } from 'react'
import { ObjectInspector } from 'react-inspector'

class MessageViewer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            showRaw: false
        }

        this.toggleRaw = this.toggleRaw.bind(this)
    }

    toggleRaw (e) {
        this.setState({
            showRaw: !this.state.showRaw
        })
    }

    render () {
        const {isJson, parsed: message, message: rawMessage} = this.props.message
        const showRaw = this.state.showRaw
        return (
            <div className="message-preview">
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
                    data={showRaw ? rawMessage : message}
                />
            </div>
        )
    }
}

export default MessageViewer
