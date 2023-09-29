import {Avatar, Modal, ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Button,useDisclosure,Image,Text,Center} from '@chakra-ui/react';
import '.././App.css';
import {ChatState} from '../context/chatProvider';
import {useEffect, useState} from 'react';
import ScrollableText from './MessageFeed';
import axios from 'axios';
import Lottie from "lottie-react";
import TypingAnimation from './animation/typing.json';
//socket.io
import io from 'socket.io-client';
import InputEmojiWithRef from 'react-input-emoji';
 const SOCEKT_ENDPOINT = process.env.REACT_APP_SOCKET_URL;

var socket;
var selectCompareChat;
const ChatBox = () => {
    const [allmessages,setAllMessages] = useState([]);
    const [socketConnected,setSocketConnected] = useState(false);
    const [sendText,setSendText] = useState('');
    const {user,token,setMyChats,myChats,selectedChat} = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    
    const getName =(chatUser)=>{
        let chatName = chatUser.length>0 && chatUser.filter(val => val.name !=user.name);
        return chatName[0].name;
    };
    const getPic=(chatUser)=>{
         let pic = chatUser.filter(val=> val._id !=user._id);
         return pic[0].pic
    };
    const sendMessage=async(e)=>{
         e.preventDefault();
        if(sendText){
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers:{
                        'Content-type':"application/json",
                        Authorization:`Bearer ${token}`
                    }
                };
                let body = {
                    content:sendText,
                    chatId:selectedChat._id
                }
               
                setSendText('');
                const data  = await axios.post(process.env.REACT_APP_API_BASE_URL+`message/sendMessage`,body,config);
                setAllMessages([...allmessages,data.data.message])
                socket.emit('new message',data.data.message)
                
            } catch (error) {
                console.log(error)
            }
        }
       
    };
    const fetchMessages = async()=>{
        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            };
            const data  = await axios.get(process.env.REACT_APP_API_BASE_URL+`message/${selectedChat._id}`,config);
            console.log('data=====',data)
            setAllMessages(data.data.message);
            socket.emit("join chat",selectedChat._id);
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchMessages();
        selectCompareChat = selectedChat;
      }, [selectedChat]);

      useEffect(() => {
         socket = io(SOCEKT_ENDPOINT);
         socket.emit('setup',user);
         socket.on('connected',()=>{
            setSocketConnected(true);
         });
         socket.on("typing", () => setIsTyping(true));
         socket.on("stop typing", () => setIsTyping(false));
      }, []);
      useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved)=>{
            console.log('neww mee',newMessageRecieved)
            if(!selectCompareChat || selectCompareChat._id != newMessageRecieved.chat._id){

            }else{
                setAllMessages([...allmessages,newMessageRecieved]);
            }
        })
      });
      const typingHandler = (e)=>{
        setSendText(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
          }
          let lastTypingTime = new Date().getTime();
          let timerLength = 2000;
          setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
              socket.emit("stop typing", selectedChat._id);
              setTyping(false);
            }
          }, timerLength);
      };
    return (
        <>
        <div className="container chatBox w-100">
            <nav className="navbar navbar-expand-lg bg-body-tertiary  mt-4 p-2 mb-2">
                <div className="d-flex align-items-center">
                    <Avatar name={selectedChat&& getName(selectedChat.users)} src={selectedChat && getPic(selectedChat.users)} className="mr-2" cursor={'pointer'} onClick={onOpen} bg='#90caf9'/>
                    <span className="ms-4 fs-4 text-capitalize text-wrap"> {selectedChat && getName(selectedChat.users)}</span>
                </div>
                <span>
                {/* <i className="bi bi-telephone-fill"></i> */}
                </span>
            </nav>
            <div className='messageFeed mb-4'>
                <ScrollableText allmessages={allmessages}/>
            </div>
            {istyping ? (
                <div>
                  <Lottie  style={{ marginBottom: 50, marginLeft: 0,width:'70px' }} animationData={TypingAnimation} loop={true} />
                </div>
              ) : (
                <></>
              )}
            <form className=" input-group msgInput" onSubmit={sendMessage}>
                <input  type="text" className="form-control chatInput" placeholder="type to chat..." aria-label="Recipient's username" aria-describedby="button-addon2" value={sendText} onChange={(e)=>typingHandler(e)}/>
                <button className=" btn btn-success" type="submit"  id="button-addon2">send</button>
            </form>
        </div>
        <Modal onClose={onClose} isOpen={isOpen} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
          <Center >  GUPP<i className="bi bi-balloon-heart-fill"></i>SHUPP</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Center >
          <Avatar
            size='2xl'
            src={getPic(selectedChat.users)}
            name={getName(selectedChat.users)}
          />
          </Center>
          <Center><Text fontSize='xl'>{getName(selectedChat.users)}</Text></Center>
          </ModalBody>
        </ModalContent>
      </Modal>
        </>
    )
};

export default ChatBox;