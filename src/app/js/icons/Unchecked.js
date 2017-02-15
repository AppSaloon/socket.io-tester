import React from 'react'
import TemplateIcon from './TemplateIcon'

const Unchecked = ({size, color, customStyle}) =>
    <TemplateIcon
        size={size}
        color={color}
        customStyle={customStyle}
        viewBox="7 6 12 12"
    >
        <path d="M14.5,7h-4C8.3,7,7,8.3,7,10.5v4c0,2.2,1.3,3.5,3.5,3.5h4c2.156,0,3.5-1.281,3.5-3.5c0,0,0-3,0-4
            C18,8.328,16.656,7,14.5,7z M15,9c0.55,0,1,0.45,1,1v5c0,0.55-0.45,1-1,1h-5c-0.55,0-1-0.45-1-1v-5c0-0.55,0.45-1,1-1H15z"/>
    </TemplateIcon>

export default Unchecked
