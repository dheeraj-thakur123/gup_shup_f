import '.././App.css';
import axios from "axios";
import {ChatState} from "../context/chatProvider";
import {useEffect, useState} from "react";
import {Avatar, useToast} from "@chakra-ui/react";


const MyChats = () => {
    const {user,token,setMyChats,myChats,selectedChat,setSelectedChat} = ChatState();
    const toast = useToast();

    const myChat = async() =>{
        try {
            const config = {
                headers:{
                    'Content-type':"application/json",
                    Authorization:`Bearer ${token}`
                }
            };
            const myChats = await axios.get(process.env.REACT_APP_API_BASE_URL+`chat/getAll`,config);
            setMyChats(myChats.data.result)
        } catch (error) {
            toast({
                title: "no chats ",
                status: "error",
                position: "top-right",
                duration: 1000,
                isClosable: true,
              });
        }
    }
    useEffect(()=>{
        myChat();
    },[])
    const getName =(user,chatUser)=>{
        console.log('loguser',user);
        console.log(chatUser)
        let chatName = chatUser.filter(val => val.name !=user.name);
        console.log(chatName)
        return chatName[0].name;
    };
    const getPic=(user,chatUser)=>{
         let pic = chatUser.filter(val=> val._id !=user._id);
         console.log(pic)
         return pic[0].pic
    };
    return (
        <div className=" container col-md-4 mt-4 w-100 p-2 mychats" style={{height:'85vh',}}>
          {myChats&&myChats.length>0&&myChats.map(val=>{
           return (
            <li class="list-group-item d-flex w-80 p-2 align-items-center bg-gradient mb-3" style={{cursor:'pointer',backgroundColor:'#90caf9',color:'black',borderRadius:'30px',height:'60px'}} onClick={()=>setSelectedChat(val)} key={val._id}>
            <Avatar name={getName(user,val.users)} src={getPic(user,val.users)} className="mr-2" />
            <span className="ms-4 fs-4 text-capitalize text-wrap"> {getName(user,val.users)}</span>
         </li>
           )
          })}
     
        </div>
    )
};

export default MyChats;