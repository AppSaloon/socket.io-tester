import React from 'react'
import { ChromePicker } from 'react-color'

const ColorPicker = ({visible, color, handleColorChange}) =>
    <div className={`column-colorpicker ${visible ? '' : 'hidden'}`}>
        <ChromePicker
            color={color}
            onChange={handleColorChange}
            onChangeComplete={handleColorChange}
        />
    </div>

export default ColorPicker
