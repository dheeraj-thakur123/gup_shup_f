import {Box,Button,Container,FormControl,FormHelperText,FormLabel,Input,TabList,TabPanel,TabPanels,Tabs,Text, useMultiStyleConfig, useTab} from "@chakra-ui/react";
import React, {useEffect} from "react";
import LoginForm from "./LogIn";
import SignUp from "./SignUpForm";
import {useHistory,useNavigate} from "react-router-dom/cjs/react-router-dom";

const Home = () => {
    const [show, setShow] = React.useState(false);
    const history = useHistory();
    useEffect(()=>{
      const data = JSON.parse(localStorage.getItem('userInfo'))
      const user = data && data.user;
      if(user){
        history.push('chats');
      } 
    },[history])
    const CustomTab = React.forwardRef((props, ref) => {
        // 1. Reuse the `useTab` hook
        const tabProps = useTab({ ...props, ref })
        const isSelected = !!tabProps['aria-selected']
    
        // 2. Hook into the Tabs `size`, `variant`, props
        const styles = useMultiStyleConfig('Tabs', tabProps)
        return (
          <Button __css={styles.tab} {...tabProps}>
            <Box as='span' mr='2'>
              {isSelected ? '😎' : '😐'}
            </Box>
            {tabProps.children}
          </Button>
        )
      });

    return(
        <>
        <Container maxW='container.sm' centerContent>
            <Box
            display={'flex'}
            justifyContent={'center'}
            // backgroundColor={'red'}
            width={'100%'}
            boxShadow='dark-lg'
            rounded='md' 
            bg='white'
            p={3}
            borderRadius={'lg'}
            borderWidth={'1px'}
            margin={'80px 0px 0px 0px'}
            >
                <Text style={{'margin':'0px'}} > GUPP<i class="bi bi-balloon-heart-fill"></i>SHUPP</Text>
            </Box>
            <Box
            margin={'10px 0px 0px 0px'}
            bg='white'
            width={'100%'}
            borderRadius={'lg'}
            p={3}
            boxShadow='dark-lg'
            >
                <Tabs colorScheme='green'>
                <TabList display={'flex'} justifyContent={'center'}>
                    <CustomTab colorScheme='green' width={'50%'}>Log-In</CustomTab>
                    <CustomTab colorScheme='red' width={'50%'}>Sign-Up</CustomTab>
                </TabList>
                <TabPanels>
                    <TabPanel><LoginForm/></TabPanel>
                    <TabPanel><SignUp/></TabPanel>
                </TabPanels>
                </Tabs>
            </Box>
        </Container>
        </>
    )
};


export default Home;