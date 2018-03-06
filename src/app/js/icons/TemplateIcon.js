import React from 'react'

const TemplateIcon = ({size, color, customStyle, viewBox, children}) =>
    <svg
        style={{
            height: size,
            fill: color,
            ...customStyle
        }}
        version="1.1"
        x="0px"
        y="0px"
        viewBox={viewBox}
    >
        {children}
    </svg>

export default TemplateIcon
