import { Provider } from 'react-redux'
import { createStore } from 'redux'
import React from 'react'
import { render } from 'react-dom'
import reducer from './reducers/reducer'

import App from './components/App'

const store = createStore(reducer,
    window.devToolsExtension ? window.devToolsExtension() : undefined
);

export { store }

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
)
