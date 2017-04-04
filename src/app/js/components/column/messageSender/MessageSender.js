/**
 * MessageSender
 *
 * MessageSenderView connector
 */

import { connect } from 'react-redux'

import MessageSenderView from './MessageSenderView'

function mapStateToProps (state) {
    return {
        activeTab: state.activeTab,
        connections: state.connections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        sendMessage (id, eventName, message) {
            dispatch({
                type: 'SEND_MESSAGE',
                id,
                eventName,
                message
            })
        }
    }
}

const MessageSender = connect(mapStateToProps, mapDispatchToProps)(MessageSenderView)

export default MessageSender
