import React, { useContext } from 'react'
import NavBar from '../../components/NavBar'
import ContactForm from '../../components/ContactForm'
import { UserContext } from '../../useContext/ThemeContext'

const HomePage = () => {

  const username = useContext(UserContext)
  return (
    <div>

        {/* <NavBar/>

        <ContactForm/> */}


      <h1>This guy name is {UserContext}</h1>
        
    </div>
  )
}

export default HomePage