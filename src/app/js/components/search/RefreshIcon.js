import React from 'react'

import RepeatIcon from '../../icons/Repeat'

const RefreshIcon = ({faded, setNamespaceAndUrl}) =>
    <span className="search-refresh" onClick={faded ? null : setNamespaceAndUrl}>
        <RepeatIcon size={24} color={faded ? '#9071b4' : '#333'} customStyle={faded ? {opacity: 0.2} : {}} />
    </span>

export default RefreshIcon
