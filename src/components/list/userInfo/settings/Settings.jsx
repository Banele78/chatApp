import React from 'react'
import "./setting.css";
import { Link } from 'react-router-dom';
import { auth } from '../../../../lib/firebase';
import { useChatStore } from '../../../../lib/chatStore';


function Settings() {
  const {logout} = useChatStore();

  return (
    <div className='settings'>
      <Link to="/">  <button className='logout' onClick={()=>logout()}>  Logout</button></Link> 
    </div>
  )
}

export default Settings
