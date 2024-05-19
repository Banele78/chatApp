import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from "../../lib/firebase"
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/UserStore';
import upload from '../../lib/upload';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Chat() {
  const [chat, setChat]= useState(null);
  const [open, setOpen]= useState(false);
  const [text, setText]= useState("");
  const [img, setImg] = useState({
    file:null,
    url:"",
  });

  const endRef =useRef(null);
  const [isSendig, setIsSending] = useState(false);


  const {currentUser} = useUserStore();
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();

  useEffect (()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"});
  },[chat]);

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

  const handleEmoji = e =>{
    setText(prev=>prev+e.emoji);
    setOpen(false);
  };

  const handleImg = e =>{
    if(e.target.files[0]){
        setImg({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        });
    };
};


const formatDate = (date) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};
const formattedDate = formatDate(new Date());

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
 

  return `${hours}:${minutes}`;
};

  const handleSend = async () =>{
    if(text==="") return;

    let imgUrl =null;

    try{
      setIsSending(true);

      if(img.file){
        imgUrl= await upload(img.file);
      }

      await updateDoc(doc(db,"chats", chatId), {
        messages:arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: formattedDate,
          time: getCurrentTime(),
          ...(imgUrl && {img: imgUrl}),
          ...(imgUrl && {imgname: img.file.name}),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id)=>{
        const userChatsRef = doc(db, "userchats", id);
        const UserChatsSnapshot = await getDoc(userChatsRef);
  
        if(UserChatsSnapshot.exists()){
          const userChatsData= UserChatsSnapshot.data();
  
          const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId);
  
          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true :false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })

     
    }catch(err){
      console.log(err);
    }finally{
      setIsSending(false);
      setImg({
        file:null,
        url:""
      });
  
      setText("");

    }

    
  }

  let lastDisplayedDate = null;

  return (
    <div className='chat'>
    <div className="top">
      <div className="user">
        <img src={user?.avatar||"./avatar.png" }alt=""/>
        <div className="texts">
          <span>{user?.username}</span>
          <p>Lorem ipsum dolor, sit amet.</p>
        </div>
      </div>
      <div className="icons">
      <img src="./phone.png" alt=""/>
      <img src="./video.png" alt=""/>
     <Link to="/detail"><img src="./info.png" alt=""/></Link> 
      </div>
     
    </div>
    <div className="center">
      
    {chat?.messages?.map((message, index) => {
        const messageDate = message.createdAt;
        const showDate = messageDate !== lastDisplayedDate;
        lastDisplayedDate = messageDate;

        return (
          <React.Fragment key={index}>
            {showDate && <div className='showDate'>{messageDate}</div>}
            <div className={message.senderId === currentUser?.id ? "message own" : "message"}>
              <div className="texts">
                {message.img && <img src={message.img} alt="message" />}
                <p>{message.text}</p>
                <span>{message.time}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}

{img.url && 
<div className="message own">
  <div className="texts">
    <img src={img.url} alt=""/>
  </div>
</div>}
      <div ref={endRef}></div>
    </div>
    <div className="bottom">
      <div className="icons">
        <label htmlFor="file">
        <img src="./img.png" alt=""/>
        </label>
       
        <input type="file" id="file" style={{display:"none"}} onChange={handleImg}/>
       {/*<img src="./camera.png" alt=""/>
        <img src="./mic.png" alt=""/>*/}
      </div>
      <input type="text" 
      placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : 'Type a message...'}
       value={text} 
       onChange={e=>setText(e.target.value)}
       disabled={isCurrentUserBlocked || isReceiverBlocked}/>
      <div className="emoji">
        <img src="./emoji.png" alt="" onClick={()=>setOpen((prev)=>!prev)}/>
        <div className="picker">
        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
        </div>
     
      </div>
      {!isSendig ? (<>
        <button className='sendButton' onClick={handleSend}
      disabled={isCurrentUserBlocked || isReceiverBlocked || isSendig}>Send</button>
      </>): (<>
        <button className='sendButton' onClick={handleSend}
      disabled={isCurrentUserBlocked || isReceiverBlocked || isSendig}>
        <div className="spinner"></div></button>
      </>)}
      
    </div>
    </div>
  )
}

export default Chat
