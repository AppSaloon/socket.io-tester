const defaultState = {}

export default function messages (state = defaultState, action) {
    switch (action.type) {

        case 'ADD_MESSAGE':
        return addMessage(state, action)

        case 'REMOVE_MESSAGES':
        return removeMessages(state, action)

        case 'REMOVE_ALL_MESSAGES':
        return {}

        default:
        return state
    }
}

/**
 * Adds a new message to the store
 */
function addMessage (state, action) {
    const id = action.id
    const eventName = action.eventName

    const socketCollection = Object.assign({}, state[id])
    const eventMessages = [].concat(socketCollection[eventName] || [])

    eventMessages.push({message: action.message, timestamp: new Date().getTime()})

    if ( eventMessages.length > 60 )
        eventMessages.shift()

    socketCollection[eventName] = eventMessages

    return Object.assign({}, state, {[id]: socketCollection})
}

/**
 * Removes messages from the store
 */
function removeMessages (state, action) {
    const newState = Object.assign({}, state)
    const myMessages = Object.assign({}, newState[action.id])
    delete myMessages[action.eventName]
    newState[action.id] = myMessages
    return newState
}
