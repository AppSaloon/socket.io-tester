/**
 * MessageSenderView
 *
 * Message editor
 */

import React, { Component, Fragment } from 'react'
import Autosuggest from 'react-autosuggest'
import Editor from './Editor'

// import TriangleBottomIcon from '../../../icons/TriangleBottom'

class MessageSender extends Component {
    constructor (props) {
        super(props)

        this.state = {
            tab: this.getThisTab(props),
            eventName: '',
            messageCollection: [{type: 'String', value: '', isValid: true}],
            messageInEditor: 0,
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
        this.noMessageArgument = this.noMessageArgument.bind(this)
        this.changeType = this.changeType.bind(this)
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

    /**
     * Change message type and value if required
     * @param {event} e - input change event
     */
    changeType (e) {
        const state = this.state
        const messageCollection = state.messageCollection.slice()
        const type = e.target.value
        let isValid = true
        let value = messageCollection[state.messageInEditor].value
        switch ( type ) {
            case 'Boolean':
            value = 'true'
            break

            case 'Number':
            value = ~~value
            break

            case 'Object':
            case 'Array':
            const parsedValue = this.testObjValid(value)
            if ( parsedValue && Object.prototype.toString.apply(parsedValue).slice(8, -1) === type )
                isValid = true
            else
                isValid = false
            break

            case 'String':
            try { // stringify current value in case it's an object or it'll look like "[object Object]", if JSON.parse works it's already a string, so we don't need to change it
                JSON.parse(value)
                value = value + '' // convert boolean to string or codemirror throws an error
            } catch ( e ) { // if it throws we know it's not a JSON string already and we have to stringify it
                value = JSON.stringify(value)
            }
            break

            case 'JSON':
            try { // if JSON.parse works it's valid JSON
                JSON.parse(value)
            } catch ( e ) {
                isValid = false
            }
            break
        }
        messageCollection[state.messageInEditor] = {
            value,
            type,
            isValid
        }
        this.setState({
            messageCollection
        })
    }

    /**
     * Update message and validation
     */
    handleMessageChange (value) {
        const state = this.state
        const messageCollection = state.messageCollection.slice()
        const messageInEditor = state.messageInEditor
        const message = messageCollection[messageInEditor]

        const type = message.type
        let isValid = message.isValid

        switch ( type ) {
            case 'Object':
            case 'Array':
            isValid = !!this.testObjValid(value)
            break

            case 'JSON':
            try {
                JSON.parse(value) // if it doesn't throw it's a valid JSON string
                isValid = true
            } catch ( e ) {
                isValid = false
            }
        }

        messageCollection[messageInEditor] = {
            value,
            isValid,
            type
        }
        this.setState({
            messageCollection
        })
    }

    testObjValid (value) {
        let evalResult, JSONResult
        try {
            eval(`evalResult = ${value}`) // if it doesn't throw it's a valid array or object
        } catch ( e ) {}
        try {
            JSONResult = JSON.parse(value) // if it doesn't throw it's a valid array or object
        } catch ( e ) {}
        return evalResult || JSONResult
    }

    /**
     * Saves new message in redux store if name and message are valid
     */
    handleMessageSend () {
        if ( !this.state.tab.connected )
            return

        if ( this.state.eventName )
            this.props.sendMessage(this.props.activeTab, this.state.eventName, this.state.messageCollection)
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

    /**
     * Add one mesage argument
     */
    addMessageArgument () {
        const messageCollection = this.state.messageCollection
        this.setState({
            messageCollection: messageCollection.concat({type: 'String', value: '', isValid: true}),
            messageInEditor: messageCollection.length
        })
    }

    /**
     * Remove a specific message argument
     */
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

    /**
     * Remove all message content
     */
    noMessageArgument () {
        this.setState({
            messageCollection: [],
            messageInEditor: -1
        })
    }

    render () {
        const state = this.state
        const connected = state.tab.connected
        const messageInEditor = state.messageInEditor
        const messageInEditorObject = state.messageCollection[state.messageInEditor]

        const autosuggestInputProps = {
            placeholder: 'Event name',
            value: state.eventName,
            onChange: this.handleEventNameChange
        };

        let sendIsEnabled = true
        if (  !connected || !state.eventName || ( ~messageInEditor && !state.messageCollection.map( m => m.isValid ).reduce( (a, b) => a && b) ) )
            sendIsEnabled = false

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
                                <button
                                    onClick={this.noMessageArgument}
                                    className="message-arguments-buttons-button"
                                >
                                    None
                                </button>
                            </div>
                        </div>
                    </div>

                    { ~messageInEditor ?
                        <Fragment>
                            <div className="column-string">
                                <span>
                                    <select value={messageInEditorObject.type} onChange={this.changeType}>
                                        <option value="String">String</option>
                                        <option value="JSON">JSON</option>
                                        <option value="Array">Array</option>
                                        <option value="Object">Object</option>
                                        <option value="Number">Number</option>
                                        <option value="Boolean">Boolean</option>
                                    </select>
                                </span>
                            </div>

                            <button
                                className="column-button"
                                onClick={this.handleClearClick}
                            >
                                Clear
                            </button>

                            <Editor message={messageInEditorObject} handleMessageChange={this.handleMessageChange} />
                        </Fragment>
                        : null
                    }

                    <button
                        className="column-button"
                        disabled={!sendIsEnabled}
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
