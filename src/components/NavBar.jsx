import React, {useState} from 'react'
import "./NavBar.css"
import { IoIosArrowDown } from "react-icons/io";
import Modal from "./Modal"
const NavBar = () => {

      const [isOpen, setisOpen] = useState(false)

   
          
    function servicesMenu (){
        
       setisOpen(!isOpen)

     
       
       
    }

    function handleCloseServices(){
        setisOpen(!isOpen)
    }
  return (
    <div className='flex '>
        <nav>HOME</nav>
        <nav className='flex' onMouseEnter={servicesMenu} >SERVICES <span><IoIosArrowDown/> </span></nav>
        <nav>SAVINGS</nav>
        <nav>ABOUT</nav>
        <nav>CONTACT</nav>

         {isOpen && <Modal runAFunction={handleCloseServices} />}
    </div>

   
  )
}

export default NavBar