import React from 'react'
import TemplateIcon from './TemplateIcon'

const Repeat = ({size, color, customStyle}) =>
    <TemplateIcon
        size={size}
        color={color}
        customStyle={customStyle}
        viewBox="6 6 12 12"
    >
        <path
            d="M17.771,12c0,3.188-2.584,5.771-5.771,5.771S6.229,15.188,6.229,12S8.813,6.228,12,6.228
                c1.305,0,2.504,0.441,3.47,1.172l1.347-1.347C16.918,5.953,17,5.987,17,6.129V6.25v3.492V9.75C17,9.888,16.888,10,16.75,10h-0.008
                H13.25h-0.121c-0.142,0-0.176-0.082-0.076-0.182l1.33-1.33C13.704,8.017,12.89,7.728,12,7.728c-2.355,0-4.271,1.916-4.271,4.272
                c0,2.355,1.916,4.271,4.271,4.271s4.271-1.916,4.271-4.271H17.771z"
        />
    </TemplateIcon>

export default Repeat
