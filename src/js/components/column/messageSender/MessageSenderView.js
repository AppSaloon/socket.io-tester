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
            message: '',
            messageIsJson: false,
            autosuggestResults: []
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleEventNameChange = this.handleEventNameChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleClearClick = this.handleClearClick.bind(this)
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
        this.getSuggestionValue = this.getSuggestionValue.bind(this)
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

    handleEventNameChange (e, {newValue, method}) {
        this.setState({
            eventName: newValue
        })
    }

    handleMessageChange (newValue) {
        this.setState({
            message: newValue,
            messageIsJson: this.jsonOrText(newValue)
        })
    }

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

    handleFormSubmit (e) {
        e.preventDefault()

        if ( !this.state.tab.connected )
            return

        if ( this.state.eventName && this.state.message )
            this.props.sendMessage(this.props.activeTab, this.state.eventName, this.state.message)
    }

    handleClearClick (e) {
        e.preventDefault()

        this.setState({
            message: ''
        })
    }

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

    render () {
        const state = this.state
        const connected = state.tab.connected

        const autosuggestInputProps = {
            placeholder: 'Event name',
            value: this.state.eventName,
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

                    <input
                        type="button"
                        value="Clear"
                        className="column-button"
                        onClick={this.handleClearClick}
                    />

                    <CodeMirror
                        className="column-editor"
                        value={this.state.message}
                        onChange={this.handleMessageChange}
                        options={{mode: {name: 'javascript', json: true}}}
                    />

                    <input
                        type="submit"
                        className="column-button"
                        disabled={!connected}
                        value="Send message"
                        onClick={this.handleFormSubmit}
                    />
                </div>

            </div>
        )
    }
}

export default MessageSender
