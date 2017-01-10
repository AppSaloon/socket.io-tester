import React from 'react'

import Column from      './column/ColumnView'
import Head from        './head/Head'
import Message from     './messages/Messages'
import Search from      './search/Search'
import ColorPicker from './ColorPicker'

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
    </div>

export default App
