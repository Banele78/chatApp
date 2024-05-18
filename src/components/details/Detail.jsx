import React, { useEffect, useState } from 'react'
import "./details.css"
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/UserStore';
import { useChatStore } from '../../lib/chatStore';
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Detail() {
  const [chat,setChat] = useState(null);
  const [showImgs, setShowImgs] = useState(false);
 

  const {currentUser} = useUserStore();
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked,  changeBlock} = useChatStore();

  const handleBlock = async () =>{
  if(!user) return;
  const userDocRef = doc(db,"users", currentUser.id);

  try{

    await updateDoc(userDocRef,{
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),

    });

    changeBlock();

  }catch(err){
  console.log(err);
  };
  };

  useEffect(()=>{
    const unSub = onSnapshot
    (doc(db, "chats", chatId),
     (res)=>{
       setChat(res.data());
    });

    return () =>{
      unSub();
    };
  },[chatId]);

  const downloadImg = (url, imageName) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a link element
        const link = document.createElement('a');
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        // Set the download attribute with a filename
        link.href = blobUrl;
        link.download = imageName; // You can set a default name or use a dynamic name
        // Append the link to the body (required for Firefox)
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Clean up and remove the link
        link.remove();
        // Revoke the blob URL after a delay to ensure the download completes
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      })
      .catch(error => {
        console.error('Error downloading the image:', error);
      });
  };

  const logOut = ()=>{
    ()=>auth.signOut()
  }

  
 
  
  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt=""/>
        <h2>{user?.username}</h2>
        <p>I am awesome.</p>
      </div>

      <div className='info'>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src={showImgs ? "./arrowDown.png" : "./arrowUp.png"} 
            alt=""
            onClick={()=>setShowImgs(prev=>!prev)}/>
          </div>
        </div>

        {showImgs && 
        <>
        {chat?.messages?.map((message)=>(
          <>
             {message.img &&
       <div className="photos" key={message?.createdAt}>
       
         <div className="photoItem">
           <div className="photoDetail">
            <img src={message.img} alt=""/>
          <span>{message.imgname}</span>
            </div>
            <img src="./download.png" 
            alt="" className='icon' 
            onClick={()=>downloadImg(message.img, message.imgname)}/>
          </div>
          
         </div>
        }
         </>
        ))}
        </>
      }

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>

       <button onClick={handleBlock}>
          {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block User"}
          </button>
          <Link to="/">  <button className='logout' onClick={()=>auth.signOut()}>  Logout</button></Link> 
      </div>

    
    </div>
  )
}

export default Detail
