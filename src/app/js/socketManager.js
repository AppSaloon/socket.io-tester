import { store } from './index'

import io from 'socket.io-client'

const storedConnections = {}

/**
 * Returns current store state
 * Returns empty object if store isn't available yet
 * 
 * @return {Object} store state
 */
function getState () {
    let result = {}
    if ( store )
        result = store.getState()
    return result
}

/**
 * Creates new connection object
 * 
 * @param  {String} id unique id to keep track of the socket with
 */
function createNewConnection (id) {
    storedConnections[id] = {
        url: '',
        socket: null,
        events: []
    }

    tryToSubscribeOrRetry(id)
}

/**
 * Subscribes a listener to the store for a specific subscribed socket (the listener will update the socked based on changes made in the app)
 * Retries automaticaly of store in unavailable
 * 
 * @param  {String} id unique id of the socket
 */
function tryToSubscribeOrRetry (id) {
    if ( store )
        storedConnections[id].unsubscribe = store.subscribe(listenForChanges.bind(id))
    else
        waitAndRetry(id)
}


function removeConnection (id) {

    const connection = storedConnections[id]

    if ( connection.socket )
        connection.socket.disconnect()

    if ( connection.unsubscribe )
        connection.unsubscribe()

}

export { createNewConnection, removeConnection }

/**
 * Creates the socket.io connection and listens for changes made in the store (by actions in the app by the user)
 * and updates the socket accordingly
 *
 * - Creates socket.io connection
 * - Adds and removes events the socket should listen to
 * - Updates socket url
 */
function listenForChanges () {
    const state = getState()
    const id = this
    const storedConnection = storedConnections[id]
    const connection = state.connections.list[state.connections.connections[id].index]

    const url = connection.url
    let namespace = connection.namespace || ''

    if ( url !== storedConnections[id].url || namespace !== storedConnections[id].namespace) {

        storedConnections[id].url = url
        storedConnections[id].namespace = namespace

        let socket = storedConnection.socket

        if ( socket /*&& socket.connected*/ ) { // this means the url was changed, previous connection gets removed and a new one is made
            socket.disconnect()
            // TODO all events that were added previously need to be added to the new socket
        }

        if ( url ) {
            const parsedURL = new URL(url);
            const path = parsedURL.pathname === '/' ? '/socket.io' : parsedURL.pathname
            socket = io(parsedURL.origin + namespace, {path});
            storedConnections[id].socket = socket

            socket.on('connect', function () {
                store.dispatch({type: 'REMOVE_ALL_MESSAGES'})
                store.dispatch({type: 'REMOVE_ALL_SENTMESSAGES'})
                store.dispatch({type: 'SET_CONNECTED', id})
            })
            socket.on('disconnect', function () {
                store.dispatch({type: 'SET_DISCONNECTED', id})
            })

        }
    }

    // add or remove events
    const differenceInEvents = compareLists(connection.events, storedConnection.events)
    // socket should listen to the events in the generated list: differenceInEvents
    if ( differenceInEvents.length ) {
        const socket = storedConnection.socket
        storedConnections[id].events = connection.events.slice()
        differenceInEvents.forEach(event => socket.on(event.name, messageHandler.bind(socket, id, event.name)))
    } else {
        const invertedDifferenceInEvents = compareLists(storedConnection.events, connection.events)
        // socket should stop listening to the events in the generated list: invertedDifferenceInEvents
        if ( invertedDifferenceInEvents.length ) {
            const socket = storedConnection.socket
            storedConnections[id].events = connection.events.slice()
            invertedDifferenceInEvents.forEach(event => socket.off(event.name))
        }
    }
}

/**
 * Store a message received on a socket event
 * 
 * @param  {String} id        unique socket id
 * @param  {String} eventName name of the event the message was received on
 * @param  {Mixed}  message   received messagem  can be multiple arguments
 */
function messageHandler (id, eventName/*, message arguments*/) {
    store.dispatch({type: 'ADD_MESSAGE', id, eventName, message: [].slice.call(arguments, 2)})
}

/**
 * Returns difference between 2 arrays of socket events
 * 
 * @param  {Array} list1 array of events
 * @param  {Array} list2 array of events
 * 
 * @return {Array}       list of events not included in 1st array
 */
function compareLists (list1, list2) {
    const difference = []
    let event
    let exists
    for ( let x = 0, l = list1.length; x < l; x++ ) {
        event = list1[x]
        exists = false
        for ( let y = 0, l = list2.length; y < l; y++ ) {
            if ( event.name === list2[y].name )
                exists = true
        }
        if ( !exists )
            difference.push(event)
    }
    return difference
}

/**
 * Waits 10ms before retrying tryToSubscribeOrRetry()
 * 
 * @param  {String} id unique socket id
 */
function waitAndRetry (id) {
    setTimeout(function () {
        tryToSubscribeOrRetry(id)
    }, 10)
}

/**
 * Call subscribeSendMessageListener() if store is available, retry in 10ms if it's not
 */
function retryLater () {
    setTimeout(function () {
        if ( store )
            subscribeSendMessageListener()
        else
            retryLater()
    }, 10)
}

/**
 * Listens to the store to determine when a subscribed socket has to emit a message
 */
function subscribeSendMessageListener () {

    let previousState = store.getState().sentMessages

    store.subscribe(function () {
        const state = store.getState()

        const sentMessages = state.sentMessages

        if ( previousState.length < sentMessages.length ) {
            previousState = sentMessages

            const newMessage = sentMessages.slice(-1)[0]

            const connection = storedConnections[newMessage.socketId]

            const socket = connection.socket

            socket.emit( newMessage.eventName, ...newMessage.message.map( m => {
                const value = m.value
                switch ( m.type ) {
                    case 'String':
                    case 'JSON':
                    return value

                    case 'Boolean':
                    return value === 'true'

                    case 'Object':
                    case 'Array':
                    let evalResult
                    eval(`evalResult = ${value}`)
                    return evalResult

                    case 'Number':
                    return ~~value
                }
            } ) )

        } else if (previousState.length > sentMessages.length) {
            // update the record of sent messages when queue is cleared
            previousState = store.getState().sentMessages
        }
    })
}

// initialise sendMessageListener
if ( store )
    subscribeSendMessageListener()
else
    retryLater()
