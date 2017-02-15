import React from 'react'
import TemplateIcon from './TemplateIcon'

const RemoveIcon = ({size, color, customStyle}) =>
    <TemplateIcon
        size={size}
        color={color}
        customStyle={customStyle}
        viewBox="6 6 12 12"
    >
        <path
            d="M16.825,15.036l-1.787,1.788c-0.098,0.099-0.26,0.099-0.358,0L12,14.146l-2.679,2.679
                c-0.098,0.098-0.26,0.098-0.358,0l-1.788-1.788c-0.098-0.099-0.098-0.26,0-0.358l2.679-2.679L7.176,9.32
                c-0.098-0.098-0.098-0.26,0-0.358l1.788-1.787c0.099-0.098,0.26-0.098,0.358,0L12,9.853l2.679-2.679
                c0.098-0.098,0.26-0.098,0.358,0l1.788,1.788c0.098,0.098,0.098,0.26,0,0.358l-2.678,2.678l2.679,2.679
                C16.923,14.776,16.923,14.937,16.825,15.036z"
            />
    </TemplateIcon>

export default RemoveIcon
