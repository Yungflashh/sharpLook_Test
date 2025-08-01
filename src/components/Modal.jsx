import React from 'react'
import Button from './Button'

const Modal = ({runAFunction}) => {
    
  return (
    <div>

        <nav>SAVE</nav>
        <nav >INVEST  </nav>
        <nav>FUNDS</nav>
        <nav>TOP UP</nav>
       <Button btnColor="red" pad ="20px" textColor="White" text="ahmed is a Fool" ClickaMe={runAFunction}/>
      <Button btnColor={"yellow"} text={"Open"} onClick={runAFunction}/>
       
    </div>
  )
}

export default Modal