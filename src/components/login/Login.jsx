import React, { useState } from 'react'
import "./login.css";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';


function Login() {
    const [avatar, setAvatar] = useState({
        file:null,
        url:""
    });

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(false);

    const handleAvatar = e =>{
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    };

    const handleRegister = async (e) =>{
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        const {username,email,password, password2} = Object.fromEntries(formData);

    try{
        if(!avatar.file){
            toast.error("Please select an image");
            return;
        }else if(!username){
            toast.error("Please enter username");
            return;
        }else if(!email){
            toast.error("Please enter email");
            return;
        }else if(!password){
            toast.error("Please enter password")
            return;
        }else if(password !== password2){
            toast.error("Password does not match")
            return;
        }

            const res = await createUserWithEmailAndPassword(auth, email,password);
            const  imgURL = await upload(avatar.file)

            await setDoc (doc(db, "users", res.user.uid),{
                username,
                email,
                avatar:imgURL,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc (doc(db, "userchats", res.user.uid),{
                chats:[],
            });

            toast.success("Account created! You can login now!");
        
            setPage(false);
    }catch(err){
        console.log(err);
        toast.error(err.message);
    } finally{
        setLoading(false);
       
        auth.signOut();
    }
}

    const handleLogin = async (e) =>{
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        const {email,password} = Object.fromEntries(formData);

      try{
        
      await signInWithEmailAndPassword(auth,email,password);
      }catch(err){
         console.log(err)
         toast.error(err.message)
      }finally{
        setLoading(false);
      }
    }


  return (
    <div className='login'>
          <div className={page ? "item Mobile" : "item loginMessage"}>
      <h1>Already Registered!</h1>
      <div>Please log in to continue chatting.</div>
      <div className="setPage" onClick={()=>setPage(false)}>login</div>
    </div>
    <div className={!page ? "item" : "item login"}>
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
            <input type="text" placeholder='Email' name="email"/>
            <input type="password" placeholder='Password' name="password"/>
            <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>

        </form>
        <div className='hideText'>
            <p>Not Registered!</p>
            <div className="setPage"onClick={()=>setPage(true)}>Sign up</div>
            </div>
       
    </div>
  
   
    <div className='separator'></div>
    <div className={!page ? "item Mobile" : "item registerMessage"}>
    <h1>Not Registered!</h1>

    <div>Create an account to start using ConvoSync.</div>
    <div  className="setPage" onClick={()=>setPage(true)}>Sign up</div>
    </div>
    <div className={page ? "item" :"item register"}>
    <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
            <label htmlFor='file'>
            <img src={avatar.url || "./avatar.png"} alt=""/>
                Upload an image</label>
           
            <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
            <input type="text" placeholder='Username' name="username"/>
            <input type="text" placeholder='Email' name="email"/>
            <input type="password" placeholder='Password' name="password"/>
            <input type="password" placeholder='Comfirm Password ' name="password2"/>
            <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>

        </form>
        <div className='hideText'>
            <p>Already Registered!</p>
            <div className="setPage" onClick={()=>setPage(false)}>login</div>
            </div> 
    </div>
    </div>
  )
}

export default Login
