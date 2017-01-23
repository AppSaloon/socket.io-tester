const defaultState = -1

export default function activeTab (state = defaultState, action) {
    switch (action.type) {

        case 'SET_ACTIVE_TAB':
        return action.id

        default:
        return state
    }
}
