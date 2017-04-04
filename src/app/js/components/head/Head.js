/**
 * Head
 *
 * HeadView connector
 */

import { connect } from 'react-redux'

import HeadView from './HeadView'

function mapStateToProps (state) {
    return {
        connections: state.connections,
        activeTab: state.activeTab
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addConnection (id) {
            dispatch({
                type: 'ADD_CONNECTION',
                id
            })
        },
        setActiveTab (id) {
            dispatch({
                type: 'SET_ACTIVE_TAB',
                id
            })
        },
        closeTab (id) {
            dispatch({
                type: 'REMOVE_CONNECTION',
                id
            })
        },
        setTabOrder (id, order) {
            dispatch({
                type: 'SET_SETTABORDER',
                id,
                order
            })
        }
    }
}

const Head = connect(mapStateToProps, mapDispatchToProps)(HeadView)

export default Head
