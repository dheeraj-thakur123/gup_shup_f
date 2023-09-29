import React, {useEffect,useState} from "react";
import {ChatState} from "../context/chatProvider";
import {useHistory,useNavigate} from "react-router-dom/cjs/react-router-dom";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import {Avatar, AvatarBadge, Image,Modal, ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,Button,useDisclosure,Center,Text} from "@chakra-ui/react";

const Chat = () => {
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[open,setOpen]= useState(false);
    useEffect(()=>{
      const data = JSON.parse(localStorage.getItem('userInfo'))
      const user = data && data.user;
      if(!user){
        history.push('/');
      } 
    },[history])
    const {user,selectedChat,setSelectedChat,setMyChats,setToken,setUser} = ChatState();
    const logOut = () => {
      setUser({});
      setSelectedChat(null);
      setMyChats([]);
      setToken('');
      localStorage.clear();
      history.push('/')
    }
 
    return(
        <>
          <nav className="navbar  fixed-top px-3 " style={{backgroundColor:"#0dcaf0"}}>
          <div className="d-flex justify-content-between w-100  align-items-center">
          {!!user && <SideDrawer/>}
          <span className="navbar-text" style ={{color:"whitesmoke", fontSize:"22px"}}>
          GUPP <span id="boot-icon" className="bi bi-heart-fill" style={{fontSize: "22px", "color": "rgb(255, 0, 0)"}}></span> SHUPP
          </span>
         <div className="d-flex justify-content-center align-items-center ">
           <i className="bi bi-bell-fill " style={{"fontSize": "2rem", "color": 'cornflowerblue','marginRight':'10px'}}></i>
            <div className="float-end" >
              <Avatar size={"md"} onClick={onOpen} cursor={'pointer'}  src={user && user.pic} name={user && user.name}>
              <AvatarBadge boxSize='1.25em' bg='green.500' />
              </Avatar>
            </div>
         </div>
          </div>
        </nav>
        <div className="row mt-5  w-100 justify-content-center chatboxContainer">
          <div className="col-md-3 border-end border-success d-none d-lg-block ">
            {!!user && <MyChats/>}
          </div>
          <div className="col-md-9 ">
            {!!selectedChat && <ChatBox/>}
          </div>
        </div>

{/* //Profile Model */}
      <Modal onClose={onClose} size={'sm'} isOpen={isOpen} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
          <Center >  GUPP<i className="bi bi-balloon-heart-fill"></i>SHUPP</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {user && user.pic?<Center><Image
            src={user && user.pic}
            alt={user && user.name}
              /></Center>:<Center><Avatar
              size='xl'
              // mb={'5px'}
              name={user && user.name}
            /></Center>}
          <Center><Text fontSize='xl'>{user && user.name}</Text></Center>
          </ModalBody>
          <div>
          <Center  h='100%' w='100%'>
              {/* <Button size='lg' colorScheme='red'  onClick={logOut}>
                log-out
              </Button> */}
              <div className="d-grid gap-2 col-6 mx-auto mb-3">
                <button className="btn btn-outline-danger" type="button" onClick={logOut}>log-out</button>
              </div>
          </Center>
          </div>
        </ModalContent>
      </Modal>
        </>
    )
};

export default Chat;