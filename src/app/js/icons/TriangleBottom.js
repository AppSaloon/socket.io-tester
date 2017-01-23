import React from 'react'

const TriangleBottom = ({size, color, customStyle}) =>
    <svg style={Object.assign({height: size, fill: color}, customStyle)} version="1.1" x="0px" y="0px" viewBox="7 7 12 12">
        <path
            d="M12.646,14.646L7.707,9.707C7.318,9.318,7.45,9,8,9h10
                c0.55,0,0.682,0.318,0.293,0.707l-4.939,4.939C13.159,14.841,12.841,14.841,12.646,14.646z"
        />
    </svg>

export default TriangleBottom
