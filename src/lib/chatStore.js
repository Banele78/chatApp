//https://docs.pmnd.rs/zustand/getting-started/introduction
import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db, auth } from './firebase';
import { useUserStore } from './UserStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user:null,
 isCurrentUserBlocked:false,
 isReceiverBlocked:false,
  changeChat: (chatId, user)=>{
    const currentUser =useUserStore.getState().currentUser

    //Check if current user is blocked

    if(user.blocked.includes(currentUser.id)){
        return set({
            chatId,
            user:null,
            isCurrentUserBlocked:true,
            isReceiverBlocked:false,
        })
    }//Check if receiver user is blocked
    else if(currentUser.blocked.includes(user.id)){
        return set({
            chatId,
            user:user,
            isCurrentUserBlocked:false,
            isReceiverBlocked:true,
        })
    }else{
        return set({
            chatId,
            user,
            isCurrentUserBlocked:false,
            isReceiverBlocked:false,
        })
    }

   
  },
  changeBlock: ()=>{
     set(state=>({...state,isReceiverBlocked: !state.isReceiverBlocked}))
  },

  logout: ()=>{
    set ({
        chatId:null,
        user:null,
    });
    auth.signOut();
  }
}))