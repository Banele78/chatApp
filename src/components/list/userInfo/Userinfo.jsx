import React, { useState } from 'react'
import "./userinfo.css"
import { useUserStore } from '../../../lib/UserStore'
import Settings from './settings/Settings';

function Userinfo() {
  const {currentUser} = useUserStore();
  const [addSettings, setAddSettings] = useState(false);
  return (
    <div className='userInfo'>
     <div className='user'>
        <img src={currentUser.avatar || "./avatar.png"} alt=""/>
        <h2>{currentUser.username}</h2>

     </div>
     <div className='icons'>
        <img src="./more.png" alt=""  onClick={()=>setAddSettings(prev=>!prev)}/>
        <img src="./video.png" alt=""/>
        <img src="./edit.png" alt=""/>
     </div>
     {addSettings && <Settings />}
    </div>
  )
}

export default Userinfo
