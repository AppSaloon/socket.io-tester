import { connect } from 'react-redux'

import ColumnView from './ColumnView'

function mapStateToProps (state) {
    const connections = state.connections.connections
    const list = state.connections.list.filter(c => !c.disabled)
    let activeTab = state.activeTab
    if ( activeTab === -1 )
        activeTab = list.slice(-1)[0].id
    return {
        tab: list[connections[activeTab].index],
        list
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setUrl (id, url) {
            dispatch({
                type: 'SET_URL',
                id,
                url
            })
        }
    }
}

const Column = connect(mapStateToProps, mapDispatchToProps)(ColumnView)

export default Column
