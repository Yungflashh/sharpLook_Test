
import React, { useState} from 'react'
import { toast } from 'react-toastify';


const ContactForm = () => {

       
        const [formData, setFormData] = useState({
            name : '',
            email : '',
            message : ''
        }) 
       

        const handleChange = (e) => {
            const {name, value} = e.target;
            setFormData((prevData)=> ({
                ...prevData,
                [name] : value
            }))
        }

        const handleSubmit = (e) => {
            e.preventDefault();

            console.log("This is the form we are sending to the backend ", formData);

           toast.success("User Created Successfully")
            
        }


  return (
    <>
   
        <form onSubmit={handleSubmit} style ={{maxWidth: "400px", margin:"200px auto"}}>
             <h2>SIGN UP</h2>

            <input type="text" name='name' placeholder='Please Enter your Name' required value={formData.name} onChange={handleChange}/>
            <input type="email" name='email' placeholder='Please Enter your email' required value={formData.email} onChange={handleChange}/>
            <textarea type="text" name='message' placeholder='Please Enter your message' required value={formData.message} onChange={handleChange}> </textarea>


            <button type='submit'>Register</button>
        </form>


    </>
  )
}

export default ContactForm