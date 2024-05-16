import { useEffect, useState } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/details/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useUserStore } from "./lib/UserStore"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useChatStore } from "./lib/chatStore"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"


const App = () => {

  const {currentUser, isLoading, fecthUserInfo} = useUserStore();
  const {chatId} = useChatStore();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener when component mounts
    window.addEventListener('resize', handleResize);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect (() =>{
    const unSub = onAuthStateChanged(auth, (user) =>{
      fecthUserInfo(user?.uid);
    });

    return () =>{
      unSub();
    };
  },[fecthUserInfo]);

  console.log(currentUser)

  if (isLoading) return <div className="loading">Loading...</div>

 

  


  return (
   <Router>
    <div className='container'>
      {screenWidth >800 ? <>
      {
        currentUser ? (
        <>
      <List/>
    {chatId &&  <Chat/>}
      {chatId && <Detail/>}
        </> 
        ) : (
        <Login/>
      )
      
    }
    </> : <>
    <Routes>
    <Route path="/" element={<List />} />
    {chatId && (
    <>
     <Route path="/chat" element={<Chat />} />
      </> 
    )}
    {chatId && (
              <>
                <Route path="/detail" element={<Detail />} />
              </>
            )}
    </Routes>
    
    
    </>}
    <Notification/>
    </div>
    </Router>
  )
}

export default App