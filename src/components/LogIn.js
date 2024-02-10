import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, StackDivider, VStack, useToast} from "@chakra-ui/react";
import axios from "axios";
import React, {useState} from "react";
import {useHistory} from "react-router-dom/cjs/react-router-dom.min";
import {ChatState} from "../context/chatProvider";
const LoginForm = () => {
  const urlll= process.env.REACT_APP_API_BASE_URL+'user/login'
  console.log("urlllurlllurlll", urlll)
    const [email, setEmail] = useState();
    const [pwd, setPwd] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleShowPwd = () => setShow(!show)
    const history = useHistory();
    const toast = useToast();
    const {setUser,setToken} = ChatState();

    
    const handleLogIn = async() =>{
      setLoading(true);
      try {
       const {data} =  await axios.post(urlll,{email,pwd});
       localStorage.setItem("userInfo", JSON.stringify(data));
       const token = data && data.token;
       const user = data && data.user;
       setUser(user);
       setToken(token);
            console.log(data)
            // localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            toast({
              title: "User login.",
              status: "success",
              position: "top-right",
              duration: 1000,
              isClosable: true,
            });
            history.push('chats')
      } catch (error) {
        console.log('error',error);
        toast({
          title: "wrong email/password.",
          status: "error",
          position: "top-right",
          duration: 1000,
          isClosable: true,
        });
      }

    }
    return(
        <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            onChange={(e) => {
              setEmail(e.target.value.trim());
            }}
          />
        </FormControl>
        <FormControl id="pwd" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={(e) => {
                setPwd(e.target.value.trim());
              }}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleShowPwd}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
       
        <Button colorScheme='green' onClick={handleLogIn}>Log-In</Button>
      </VStack>
    )
};

export default LoginForm;