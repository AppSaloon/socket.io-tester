import React, { Component } from 'react'

class UpdateMessage extends Component {
    constructor (props) {
        super(props)

        this.state = {
            visible: false,
            error: false
        }
    }

    componentDidMount() {
        ipcRenderer.on('showUpdateNotification', (event, url) => {
            this.setState({visible: true, error: false})
        })

        ipcRenderer.on('showUpdateErrorNotification', (event, error) => {
            this.setState({visible: true, error})
        })
    }

    render () {
        const state = this.state
        const error = state.error
        const errorMessage = Object.prototype.toString.apply(error).slice(8, -1) === 'Object' ? `${error.message} - ${error.documentation_url}` || `Error: ${JSON.stringify(error)}` : `Error: ${JSON.stringify(error)}`
        return (
            <div className={`update-message ${state.visible ? '' : 'hidden'}`}>
                { !state.error ?
                    <span>update please</span>
                    :
                    <span>{state.error.message || ''}</span>
                }
            </div>
        )
    }
}

export default UpdateMessage
