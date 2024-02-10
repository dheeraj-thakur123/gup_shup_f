import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
import {useHistory,useNavigate} from "react-router-dom/cjs/react-router-dom";
const ChatContext = createContext();
const ChatProvider = ({children})=>{
const [user,setUser] = useState();
const [token,setToken] = useState('');
const [selectedChat,setSelectedChat] = useState();
const [myChats,setMyChats] = useState();
const [loading,setLoading] = useState(false);
const [notification,setNotification] = useState([]);
const history = useHistory();

const allMessages = async()=>{
  const data = JSON.parse(localStorage.getItem('userInfo'))
  const token = data && data.token;
  const user = data && data.user;
    const config = {
        headers:{
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`
        }
    };
    const myMessages = await axios.get(process.env.REACT_APP_API_BASE_URL+`message/${selectedChat._id}`,config);
    console.log(myMessages)
    // setMyChats(myChats.data.result)

}
useEffect(()=>{
  
})
useEffect(()=>{
  const data = JSON.parse(localStorage.getItem('userInfo'))
  const token = data && data.token;
  const user = data && data.user;
  if(token){
    setToken(token);
  }
  if(!user){
     history.push('/');
  }else{
    setUser(user)
  }

},[history])
    return (
        <ChatContext.Provider value={{notification,setNotification,loading,user,setLoading,setUser,token,setToken,selectedChat,setSelectedChat,myChats,setMyChats}}>
            {children}
        </ChatContext.Provider>
    )
};
export default ChatProvider;

export const ChatState = ()=>{
    return useContext(ChatContext);
};

