const defaultState = []

export default function send (state = defaultState, action) {
    switch (action.type) {

        case 'SEND_MESSAGE':
        return addMessage(state, action)

        case 'REMOVE_ALL_SENTMESSAGES':
        return []

        default:
        return state
    }
}

/**
 * Adds a message to the store (this is a message that was sent, not received)
 */
function addMessage (state, {id, eventName, message}=action) {
    const newState = state.map(m => ({...m}))

    newState.push({socketId: id, eventName, message, timestamp: new Date().getTime()})

    return newState
}
