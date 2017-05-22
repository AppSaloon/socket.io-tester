/**
 * MessageSenderView
 *
 * Message editor
 */

import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
import Autosuggest from 'react-autosuggest'

// import TriangleBottomIcon from '../../../icons/TriangleBottom'

class MessageSender extends Component {
    constructor (props) {
        super(props)

        this.state = {
            tab: this.getThisTab(props),
            eventName: '',
            messageCollection: [''],
            messageIsJsonCollection: [],
            messageInEditor: 0,
            // message: '',
            messageIsJson: false,
            autosuggestResults: []
        }

        this.handleMessageSend = this.handleMessageSend.bind(this)
        this.handleEventNameChange = this.handleEventNameChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleClearClick = this.handleClearClick.bind(this)
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
        this.getSuggestionValue = this.getSuggestionValue.bind(this)
        this.addMessageArgument = this.addMessageArgument.bind(this)
        this.removeMessageArgument = this.removeMessageArgument.bind(this)
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

    handleEventNameChange (e, {newValue, method}) {
        this.setState({
            eventName: newValue
        })
    }

    handleMessageChange (newValue) {
        const state = this.state
        const messageCollection = state.messageCollection.slice()
        messageCollection[state.messageInEditor] = newValue
        const messageIsJson = this.jsonOrText(newValue)
        const messageIsJsonCollection = state.messageIsJsonCollection.slice()
        messageIsJsonCollection.push(messageIsJson)
        this.setState({
            messageCollection,
            // message: newValue,
            messageIsJson,
            messageIsJsonCollection
        })
    }

    /**
     * Returns true if string is valid JSON
     *
     * @param {String} string
     *
     * @return {Boolean}
     */
    jsonOrText (string) {
        let isJson
        try {
            JSON.parse(string)
            isJson = true
        }
        catch (error) {
            isJson = false
        }
        return isJson
    }

    /**
     * Saves new message in redux store if name and message are valid
     */
    handleMessageSend () {
        if ( !this.state.tab.connected )
            return

        if ( this.state.eventName && this.state.messageCollection.length )
            this.props.sendMessage(this.props.activeTab, this.state.eventName, this.state.messageCollection,this.state.messageIsJsonCollection)
    }

    /**
     * Clears message
     */
    handleClearClick () {
        const state = this.state
        const messageCollection = state.messageCollection.slice()
        messageCollection[state.messageInEditor] = ''
        this.setState({
            messageCollection
        })
    }

    /**
     * Autocomplete, filter dropdown results
     */
    onSuggestionsFetchRequested ({value}) {
        const result = []
        const events = this.state.tab.events
        let event
        for ( let x = 0, l = events.length; x < l; x++ ) {
            event = events[x]
            if ( event.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 )
                result.push(event)
        }
        this.setState({
            autosuggestResults: result
        })
    }

    /**
     * Auotocomplete, show all event names
     */
    onSuggestionsClearRequested () {
        this.setState({
            autosuggestResults: this.state.tab.events
        })
    }

    getSuggestionValue (s) {
        return s.name
    }

    renderSuggestion (s, query) {
        return (
            <span>
                {s.name}
            </span>
        )
    }

    shouldRenderSuggestions () {
        return true
    }

    addMessageArgument () {
        const messageCollection = this.state.messageCollection
        this.setState({
            messageCollection: messageCollection.concat(''),
            messageInEditor: messageCollection.length
        })
    }

    removeMessageArgument () {
        const editing = this.state.messageInEditor
        const messageCollection = this.state.messageCollection

        if ( messageCollection.length <= 1 ) return // don't remove the last item in the array

        const newMessageCollection = [].concat(messageCollection.slice(0, editing), messageCollection.slice(editing+1))
        const newMessageInEditor = editing - 1
        this.setState({
            messageCollection: newMessageCollection,
            messageInEditor: ~newMessageInEditor ? newMessageInEditor : 0
        })
    }

    render () {
        const state = this.state
        const connected = state.tab.connected
        const messageInEditor = state.messageInEditor

        const autosuggestInputProps = {
            placeholder: 'Event name',
            value: state.eventName,
            onChange: this.handleEventNameChange
        };

        return (
            <div className="column-block">
                <h3 className="column-title">Send Message</h3>
                <div
                    className="column-block-inputwrapper"
                >

                    <div className="column-block-autosuggest">
                        {/*<TriangleBottomIcon
                            size={15}
                            color={'#d6c5eb'}
                            customStyle={{
                                border: '2px solid #d6c5eb',
                                borderRadius: 5,
                                position: 'absolute',
                                right: 6,
                                top: 6
                            }}
                        />*/}

                        <Autosuggest
                            suggestions={state.autosuggestResults}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={autosuggestInputProps}
                            focusInputOnSuggestionClick={false}
                            shouldRenderSuggestions={this.shouldRenderSuggestions}
                        />
                    </div>

                    <div>
                        <span>Message arguments</span>
                        <div className="message-arguments-button-group">
                            <div className="message-arguments-buttons">
                                {
                                    state.messageCollection.map( (m, i) =>
                                        <button key={i} className={`message-arguments-buttons-button ${ messageInEditor === i ? 'active' : '' }`} onClick={() => this.setState({messageInEditor: i})}>{i+1}</button>
                                    )
                                }
                            </div>
                            <div className="message-arguments-buttons">
                                <button
                                    onClick={this.addMessageArgument}
                                    className="message-arguments-buttons-button"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={this.removeMessageArgument}
                                    className="message-arguments-buttons-button"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="column-string">
                        <span>
                            {
                                state.messageIsJson ?
                                    "JSON"
                                :
                                    "String"
                            }
                        </span>
                    </div>

                    <button
                        className="column-button"
                        onClick={this.handleClearClick}
                    >
                        Clear
                    </button>

                    <CodeMirror
                        className="column-editor"
                        value={state.messageCollection[state.messageInEditor]}
                        onChange={this.handleMessageChange}
                        options={{mode: {name: 'javascript', json: true}}}
                    />

                    <button
                        className="column-button"
                        disabled={!connected}
                        onClick={this.handleMessageSend}
                    >
                        Send message
                    </button>
                </div>

            </div>
        )
    }
}

export default MessageSender
