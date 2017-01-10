import React from 'react'

import SearchIcon from '../../icons/Search'
import ConnectionIcon from '../../icons/Connection'

const TextBar = ({url, originalUrl, changeUrl, setUrl, connected}) =>
    <span className="search-text">
        <span className="search-text-icon" onClick={setUrl}>
            {getIcon(originalUrl, connected)}
        </span>
        <form className="search-text-form" onSubmit={setUrl}>
            <input onChange={changeUrl} className="search-text-input" type="text" value={url} />
        </form>
    </span>

function getIcon (url, connected) {
    let result
    if ( connected )
        result = <ConnectionIcon size={20} color={'green'} customStyle={{transform: 'rotate(45deg)', transformOrigin: 'bottom', left: -7, position: 'relative'}} />
    else if ( !connected && url )
        result = <ConnectionIcon size={20} color={'red'} customStyle={{transform: 'rotate(45deg)', transformOrigin: 'bottom', left: -7, position: 'relative'}} />
    else
        result = <SearchIcon size={20} color={'#333'} />
    return result
}

export default TextBar
