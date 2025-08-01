import React from 'react'

const Button = ({btnColor, pad, textColor, text, ClickaMe}) => {

    const btnDesign = {
        backgroundColor : btnColor,
        padding : pad,
        color : textColor
    }
     

  return (
    <button style={btnDesign} onClick={ClickaMe}>
        {text}
    </button>
  )
}

export default Button