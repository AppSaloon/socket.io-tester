import { combineReducers } from 'redux'
import connections from './connections'
import messages from './messages'
import activeTab from './activeTab'
import sentMessages from './send'
import colorPicker from './colorPicker'

export default combineReducers({
    connections,
    messages,
    activeTab,
    sentMessages,
    colorPicker
});
