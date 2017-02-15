import React from 'react'
import TemplateIcon from './TemplateIcon'

const Check = ({size, color, customStyle}) =>
    <TemplateIcon
        size={size}
        color={color}
        customStyle={customStyle}
        viewBox="6 6 12 12"
    >
        <path d="M9.599,11.86c-0.097-0.097-0.097-0.256,0-0.354l1.01-1.009c0.097-0.097,0.256-0.097,0.354,0l1.112,1.112
            c0.097,0.097,0.256,0.097,0.354,0l3.949-3.949c0.097-0.097,0.256-0.097,0.353,0l1.009,1.01c0.097,0.097,0.097,0.256,0,0.354
            l-5.31,5.314c-0.097,0.097-0.256,0.097-0.353,0L9.599,11.86z"/>
        <path d="M15,14.309V15c0,0.55-0.45,1-1,1H9c-0.55,0-1-0.45-1-1v-5c0-0.55,0.45-1,1-1h3.492l1.774-1.774C13.865,7.091,13.444,7,13,7
            H9.5C7.3,7,6,8.3,6,10.5v4C6,16.7,7.3,18,9.5,18h4c2.2,0,3.5-1.3,3.5-3.5v-2.191L15,14.309z"/>
    </TemplateIcon>

export default Check
