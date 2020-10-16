import React from 'react'
import { BlockPicker, TwitterPicker } from 'react-color'


const ColorFilter = ()=>{
  return (
    // <BlockPicker/>
    <TwitterPicker
      triangle={"hide"}
      colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC']}
      styles={{
        'default': {
          input: {
            display: 'none'
          },
          card: {
            boxShadow: 'none',
            border: 'none'
          }
        }
      }}
      readOnly
    />
  )
}


export default ColorFilter
