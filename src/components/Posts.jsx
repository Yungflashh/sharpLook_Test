import React, { useEffect, useState } from 'react'
import axios from "axios"
import Loader from './Loader'

const Posts = () => {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [blessingerror, setBlessingError] = useState(null)

    setTimeout( useEffect(()=>{
        const fetchPosts = async ()=> {
            try{
            const response = await axios.get("https://jsonplaceholder.typicode.com/posts")

            if(!response.status == 200){
                console.log("Hello, something went off o");
                setBlessingError("AN Error Occured")
                setLoading(false)
                
            }

            setPosts(response.data)
            console.log(response);
            
            setLoading(false)
            
            }


            catch(error){
               console.log(error);
               setBlessingError("There was an Error Fetching Data")
               setLoading(false)
               
            }

            
}
        setTimeout(()=> fetchPosts(), 2000)
       

},[]))
   

    if (loading) return <Loader/>
  return (
    <>
        <div>
            <h2>Postss</h2>

            <ul>
                {posts.map(element => (
                    <div key={element.id} style={styles.card}>

                             <li > {element.title}  </li>


                    </div>
                   
                ))}
            </ul>
        </div>

    
    </>
  )
}

const styles = {

    card : {
        backgroundColor : "#0e59e2",
        border: "1px solid #ddd",
        borderRadius : "10px",
        padding : '20px',
        marginBottom : '20px',
        boxShadow : "0 2px 4px rgba(0,0,0,0.1)"
    }

}

export default Posts