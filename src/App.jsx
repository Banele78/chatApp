import { useEffect } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/details/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useUserStore } from "./lib/UserStore"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useChatStore } from "./lib/chatStore"


const App = () => {

  const {currentUser, isLoading, fecthUserInfo} = useUserStore();
  const {chatId} = useChatStore();

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

const width= 900;

  return (
    <div className='container'>
      {width>=500 && (
        <>
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
      }</>)
    }
    <Notification/>
    </div>
  )
}

export default App