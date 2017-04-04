/**
 * Messages
 *
 * Connector for the messages view of the app
 */

import { connect } from 'react-redux'

import MessagesView from './MessagesView'

function mapStateToProps (state) {
    return {
        connections: state.connections,
        activeTab: state.activeTab,
        messages: state.messages,
        sentMessages: state.sentMessages
    }
}

function mapDispatchToProps (dispatch) {
    return {
        deleteAllMessages () {
            dispatch({
                type: 'REMOVE_ALL_MESSAGES'
            })
        },
        deleteAllSentMessages () {
            dispatch({
                type: 'REMOVE_ALL_SENTMESSAGES'
            })
        }
    }
}

const Messages = connect(mapStateToProps, mapDispatchToProps)(MessagesView)

export default Messages
