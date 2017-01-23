import React from 'react'

import Column from      './column/ColumnView'
import Head from        './head/Head'
import Message from     './messages/Messages'
import Search from      './search/Search'
import ColorPicker from './ColorPicker'
import UpdateMessage from './UpdateMessage'

const App = () =>
    <div className="container">
        <Head />
        <Search />
        <div className="container-body">
            <Column />
            <span className="divider"></span>
            <Message />
        </div>
        <ColorPicker />
        <UpdateMessage />
    </div>

export default App
