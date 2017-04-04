/**
 * UpdateMessage
 *
 * Shows a message telling the user the app is outdated if the app is out of date
 */

import React, { Component } from 'react'

class UpdateMessage extends Component {
    constructor (props) {
        super(props)

        this.state = {
            visible: false,
            error: false,
            latest: ''
        }
    }

    componentDidMount () {
        ipcRenderer.on('showUpdateNotification', (event, latest) => {
            this.setState({visible: true, error: false, latest})
        })

        ipcRenderer.on('showUpdateErrorNotification', (event, error) => {
            this.setState({visible: true, error})
        })
    }

    /**
     * Opens url in system default browser
     */
    openUrl () {
        shell.openExternal("https://github.com/AppSaloon/socket.io-tester/releases")
    }

    render () {
        const state = this.state
        const error = state.error
        const errorMessage = Object.prototype.toString.apply(error).slice(8, -1) === 'Object' ? `${error.message} - ${error.documentation_url}` || `Error: ${JSON.stringify(error)}` : `Error: ${JSON.stringify(error)}`
        return (
            <div className={`update-message ${state.visible ? '' : 'hidden'}`} onClick={ () => this.setState({visible: false}) }>
                { !state.error ?
                    <span onClick={ e => e.stopPropagation() }>
                        <span>{`This version of the app is outdated, the latest version is ${state.latest}.`}</span>
                        <span>
                            <span>Get it </span>
                            <a onClick={this.openUrl}>here</a>
                            <span>.</span>
                        </span>
                    </span>
                    :
                    <span>{state.error.message || ''}</span>
                }
            </div>
        )
    }
}

export default UpdateMessage
