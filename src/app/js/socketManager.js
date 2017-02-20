import { store } from './index'

import io from 'socket.io-client';

const storedConnections = {}

function getState () {
    let result = {}
    if ( store )
        result = store.getState()
    return result
}

function createNewConnection (id) {
    storedConnections[id] = {
        url: '',
        socket: null,
        events: []
    }

    tryToSubscribeOrRetry(id)
}


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




function listenForChanges () {
    const state = getState()
    const id = this
    const storedConnection = storedConnections[id]
    const connection = state.connections.list[state.connections.connections[id].index]

    const url = connection.url
    if ( url !== storedConnections[id].url ) {

        storedConnections[id].url = url

        let socket = storedConnection.socket

        if ( socket /*&& socket.connected*/ ) {
            socket.disconnect()
        }

        if ( url ) {
            socket = io(url)
            storedConnections[id].socket = socket

            socket.on('connect', function () {
                store.dispatch({type: 'SET_CONNECTED', id})
            })
            socket.on('disconnect', function () {
                store.dispatch({type: 'SET_DISCONNECTED', id})
            })

        }
    }

    const differenceInEvents = compareLists(connection.events, storedConnection.events)
    if ( differenceInEvents.length ) {
        const socket = storedConnection.socket
        storedConnections[id].events = connection.events.slice()
        differenceInEvents.forEach(event => socket.on(event.name, messageHandler.bind(socket, id, event.name)))
    } else {
        const invertedDifferenceInEvents = compareLists(storedConnection.events, connection.events)
        if ( invertedDifferenceInEvents.length ) {
            const socket = storedConnection.socket
            storedConnections[id].events = connection.events.slice()
            invertedDifferenceInEvents.forEach(event => socket.off(event.name))
        }
    }
}

function messageHandler (id, eventName, message) {
    store.dispatch({type: 'ADD_MESSAGE', id, eventName, message})
}

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

function waitAndRetry (id) {
    setTimeout(function () {
        tryToSubscribeOrRetry(id)
    }, 10)
}


// initialise sendMessageListener
if ( store )
    subscribeSendMessageListener()
else
    retryLater()

function retryLater () {
    setTimeout(function () {
        if ( store )
            subscribeSendMessageListener()
        else
            retryLater()
    }, 10)
}

function subscribeSendMessageListener () {

    let previousState = store.getState().sentMessages

    store.subscribe(function () {
        const state = store.getState()

        const sentMessages = state.sentMessages

        if ( previousState.length !== sentMessages.length && previousState.length < sentMessages.length ) {
            previousState = sentMessages

            const newMessage = sentMessages.slice(-1)[0]

            const connection = storedConnections[newMessage.socketId]

            const socket = connection.socket

            socket.emit(newMessage.eventName, newMessage.message)
        }
    })
}
