import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import {ChatState} from "../context/chatProvider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pwd, setPwd] = useState();
  const [cnfmPwd, setCnfmPwd] = useState();
  const [pic, SetPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [camera,setCamera] = useState(false)
  const handleShowPwd = () => setShow(!show);
  const {setUser,setToken} = ChatState();
  const toast = useToast();
  const history = useHistory();
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  const cameraOn = () => (
   setCamera(!camera)
  );
  const handlePic = async (pic) => {
    if (pic === undefined) {
      toast({
        title: "Please select Picture",
        status: "warning",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
      // <Toast title={'Please Select valid picture'} status={'warning'} />
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      setLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "gupp-shupp");
      // data.append('cloud_name','dt4ndib2m');
      await axios
        .post("https://api.cloudinary.com/v1_1/dt4ndib2m/upload", data)
        .then((res) => {
          SetPic(res.data.url);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select valid picture.",
        status: "warning",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !email || !pwd || !cnfmPwd) {
      setLoading(false);
      toast({
        title: "Please fill all fields",
        status: "error",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (pwd !== cnfmPwd) {
      setLoading(false);
      toast({
        title: "Password do not match.",
        status: "warning",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const body = {
        name,
        email,
        pwd,
        pic,
      };
      const { data } = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "user/register",
        body,
        config
      );
      toast({
        title: "User created.",
        status: "success",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      const token = data && data.token;
      const user = data && data.user;
      setUser(user);
      setToken(token);
      setLoading(false);
      history.push("chats");
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        position: "top-right",
        duration: 1000,
        isClosable: true,
      });
    }
  };
  const handleClear = () => {
    setName("");
    setCnfmPwd();
    setEmail();
    setPwd();
    SetPic();
  };

  return (
    <>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            onChange={(e) => {
              setName(e.target.value.trim());
            }}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value.trim());
            }}
          />
        </FormControl>
        <FormControl id="pwd" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => {
                setPwd(e.target.value.trim());
              }}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPwd}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="cnfmpwd" isRequired>
          <FormLabel>Confirm-Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => {
                setCnfmPwd(e.target.value.trim());
              }}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPwd}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload Profile Pic</FormLabel>
          <Input
            type="file"
            accept="image/*"
            p={2}
            onChange={(e) => {
              handlePic(e.target.files[0]);
            }}
          />
        </FormControl>
        <Button colorScheme="red" onClick={handleSignUp} isLoading={loading}>
          Sign-Up
        </Button>
        <Button colorScheme="yellow" onClick={handleClear}>
          Clear
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
