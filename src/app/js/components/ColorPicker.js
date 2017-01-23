import React from 'react'
import { connect } from 'react-redux'
import { ChromePicker } from 'react-color'

const ColorPickerView = ({visible, color, top, left}) =>
    <div className={`colorpicker ${visible ? '' : 'hidden'}`} style={{top, left}}>
        <ChromePicker
            color={color}
            onChange={handleColorChange}
            onChangeComplete={handleColorChange}
        />
    </div>

function handleColorChange (color, e) {
    const colors = color.rgb
    const rgba = `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${colors.a})`
    const newEvent = new CustomEvent('colorChange', {
        detail: {
            rgba
        }
    })
    document.dispatchEvent(newEvent)
}

function mapStateToProps (state) {
    return state.colorPicker
}

const ColorPicker = connect(mapStateToProps)(ColorPickerView)

export default ColorPicker
