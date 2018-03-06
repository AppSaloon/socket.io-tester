import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'

const Editor = (props) => {
    const type = props.message.type
    let editor
    switch (type) {
        case 'String':
        editor = <TextInput {...props} />
        break

        case 'Number':
        editor = <NumberInput {...props} />
        break

        case 'Boolean':
        editor = <BoolInput {...props} />
        break

        case 'JSON':
        case 'Array':
        case 'Object':
        editor = <CodeMirrorInput {...props} />
        break

        default:
        console.warn('unhandled message type', type)
        editor = <p>unhandled message type {type}</p>
    }
    return editor
}

class TextInput extends Component {
    render () {
        const { message, handleMessageChange } = this.props
        return (
            <CodeMirror
                className="column-editor"
                value={message.value || ''}
                onBeforeChange={ (editor, data, value) => handleMessageChange(value) }
            />
        )
    }
}

class NumberInput extends Component {
    render () {
        const { message, handleMessageChange } = this.props
        return (
            <div>
                <label htmlFor="messageInput">Message: </label>
                <input
                    className="column-editor"
                    id="messageInput"
                    type="number"
                    value={~~message.value}
                    onChange={ e => handleMessageChange(e.target.value) }
                />
            </div>
        )
    }
}

class CodeMirrorInput extends Component {
    render () {
        const { message, handleMessageChange } = this.props
        const isValid = message.isValid
        return (
            <div className={["column-editor", isValid ? "" : "red-border"].join(' ')}>
                <CodeMirror
                    value={message.value || ''}
                    onBeforeChange={ (editor, data, value) => handleMessageChange(value) }
                    options={{mode: {name: 'javascript', json: true}}}
                />
            </div>
        )
    }
}

class BoolInput extends Component {
    render () {
        const { message, handleMessageChange } = this.props
        return (
            <div className="column-editor-no-border">
                <span>Boolean: </span>
                <input onChange={ e => handleMessageChange('true') } checked={message.value === 'true'} id="boolTrue" type="radio" name="boolean" />
                <label htmlFor="boolTrue">True</label>
                <input onChange={ e => handleMessageChange('false') } checked={message.value === 'false'} id="boolFalse" type="radio" name="boolean" />
                <label htmlFor="boolFalse">False</label>
            </div>
        )
    }
}

export default Editor
