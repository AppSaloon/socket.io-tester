const defaultState = {
    connections: {},
    list: []
}

export default function connections (state = defaultState, action) {
    switch (action.type) {

        case 'ADD_CONNECTION':
        return addConnection(state, action)

        case 'REMOVE_CONNECTION':
        return removeConnection(state, action)

        case 'SET_URL':
        return setUrl(state, action)

        case 'SET_CONNECTED':
        return setConnected(state, action, true)

        case 'SET_DISCONNECTED':
        return setConnected(state, action, false)

        case 'ADD_EVENT':
        return addEvent(state, action)

        case 'REMOVE_EVENT':
        return removeEvent(state, action)

        case 'TOGGLE_EVENT_VISIBILITY':
        return toggleEventVisibility(state, action)

        case 'SET_SETTABORDER':
        return changeTabOrders(state, action)

        case 'SET_EVENT_COLOR':
        return setEventColor(state, action)

        default:
        return state
    }
}

function addConnection (state, action) {
    const connections = Object.assign({}, state.connections)

    const id = action.id

    const newConnection = {
        index: state.list.length,
        id
    }

    connections[id] = newConnection

    const list = state.list.slice()

    list.push({
        url: '',
        id,
        disabled: false,
        connected: false,
        events: [],
        order: list.length + 1
    })

    return {
        connections,
        list
    }
}

function removeConnection (state, action) {
    const connection = state.connections[action.id]

    const list = state.list.slice()
    list[connection.index].disabled = true

    return {
        connections: state.connections,
        list
    }
}

function setUrl (state, action) {
    const list = state.list.slice()

    const id = action.id

    list[state.connections[id].index].url = action.url
    return {
        connections: state.connections,
        list
    }
}

function setConnected (state, action, newValue) {
    const list = state.list.slice()

    const id = action.id

    list[state.connections[id].index].connected = newValue
    return {
        connections: state.connections,
        list
    }
}

function addEvent (state, action) {
    const list = state.list.slice()

    const id = action.id

    list[state.connections[id].index].events.push(action.event)
    return {
        connections: state.connections,
        list
    }
}

function removeEvent (state, action) {
    const list = state.list.map(t => Object.assign({}, t))

    const id = action.id

    const eventName = action.eventName

    const connection = list[state.connections[id].index]
    const events = connection.events
    connection.events = events.filter( event => event.name !== eventName )

    list[state.connections[id].index] = connection

    return {
        connections: state.connections,
        list
    }
}

function toggleEventVisibility (state, action) {
    const list = state.list.slice()

    const id = action.id

    const events = list[state.connections[id].index].events.slice()

    const eventName = action.eventName
    for ( let x = 0, l = events.length; x < l; x++ )
        if ( events[x].name === eventName )
            events[x].visible = !events[x].visible

    list[state.connections[id].index].events = events

    return {
        connections: state.connections,
        list
    }
}

function changeTabOrders (state, action) {
    const list = state.list.map(t => Object.assign({}, t))

    const originalOrder = list[state.connections[action.id].index].order
    const newOrder = action.order

    let order
    const newList = list.map(tab => {
        order = tab.order
        if ( tab.id === action.id )
            tab.order = newOrder
        else {
            if ( originalOrder < newOrder ) {
                if ( order > originalOrder && order <= newOrder )
                    tab.order--
            } else if ( order < originalOrder && order >= newOrder )
                tab.order++
        }

        return tab
    })

    return {
        connections: state.connections,
        list: newList
    }
}

function setEventColor (state, action) {
    const list = state.list.map(t => Object.assign({}, t))

    const id = action.id

    const connection = list[state.connections[id].index]

    const eventName = action.eventName
    connection.events = connection.events.map(e => {
        if ( e.name === eventName )
            e.color = action.color
        return e
    })

    return {
        connections: state.connections,
        list
    }
}
