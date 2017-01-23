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

function addMessage (state, {id, eventName, message}=action) {
    const newState = state.map(m => Object.assign({}, m))

    newState.push({socketId: id, eventName, message, timestamp: new Date().getTime()})

    return newState
}
