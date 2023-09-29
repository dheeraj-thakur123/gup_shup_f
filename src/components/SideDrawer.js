import '.././App.css';
import React, {useState} from "react";
import {ChatState} from "../context/chatProvider";
import {Avatar, Button, useToast} from "@chakra-ui/react";
import MyChats from "./MyChats";
import axios from "axios";
const SideDrawer = () => {
    const [search , setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [chatLoading,setChatLoading] = useState(false);
    const [searchResult , setSearchResult] = useState([]);
    const {user,token,setSelectedChat,setMyChats,myChats} = ChatState();
    const toast = useToast();
    const handleSearch = async(e,val) => {
        let search = val?.trim();
        setSearch(search)
        // e.preventDefault();
        if(search){
            setLoading(true);
            try {
                const config = {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
                const users = await axios.get(process.env.REACT_APP_API_BASE_URL+`user/getAll?search=${search}`,config);
                console.log(users.data.user)
                setLoading(false);
                setSearchResult(users.data.user);
            } catch (error) {
                setLoading(false);
                toast({
                    title: "koi nii haiii ",
                    status: "error",
                    position: "top-right",
                    duration: 1000,
                    isClosable: true,
                  });
            }
            
        }else{
            setSearchResult([]);
        }
    };
    const accessChat = async(userId) => {
        try {
            setChatLoading(true);
            const config = {
                headers:{
                    'Content-type':"application/json",
                    Authorization:`Bearer ${token}`
                }
            };
            const {data} = await axios.post(process.env.REACT_APP_API_BASE_URL+`chat/acessChats`,{userId},config);
            console.log(data,myChats);
            debugger
            if(myChats.length>0){
                if (!myChats.find((c) => c._id === data.finalChat._id)) setMyChats([data.finalChat, ...myChats]);
            }else{
                setMyChats([data.finalChat, ...myChats]);
            }
            setSelectedChat(data.finalChat);
            setSearchResult([]);
            setSearch('');
        } catch (error) {
            console.log('=====',error)
            setSearchResult([]);
            setSearch('');
            toast({
                title: "abhi hm baat ni kar payenge.",
                status: "error",
                position: "top-right",
                duration: 1000,
                isClosable: true,
              });
        }
    };
    return (
       <div>
            <button className="btn btn-primary d-flex justify-content-center align-items-center " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
                <i className="fas fa-search pr-4"></i><p className="d-none  d-sm-block mb-0">Search</p></button>

            <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
            <div className="offcanvas-header">
                <Avatar size={"md"} cursor={'pointer'} src={user && user.pic} name={user && user.name}/>
                    <h5 className="offcanvas-title text-capitalize fs-3" id="offcanvasScrollingLabel">{user && user.name}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div style={{position:'static'}}className="offcanvas-body">
                     {/* <AsyncSelect cacheOptions loadOptions={loadOptions}  /> */}
                <form className="d-flex mb-1" role="search" >
                    <input className="form-control dropdown-toggle" type="search" placeholder="Search user" aria-label="Search" value={search} onChange={(e)=>handleSearch(e,e.target.value)}/>
                </form>
              <div  style={{ position:"absolute" ,width:'92%',background:searchResult.length>0&&'#90caf9',zIndex:'100'}} className="options p-2 h-auto">{ searchResult && searchResult.length>0 && searchResult.map((val)=>{
                     return (
                        <div className="list-group mb-2 mt-1  " style={{cursor:'pointer',borderRadius:'30px'}}  onClick={()=>accessChat(val._id)}  key={val._id} data-bs-dismiss="offcanvas">
                            <li className="list-group-item d-flex w-80 p-2 align-items-center bg-dark bg-gradient text-white">
                               <Avatar name={val.name} src={val.pic} className="mr-2" />
                               <span className="ms-4 fs-4 text-capitalize"> {val.name}</span>
                            </li>
                        </div>
                     )
                })}</div> 
               <div className="d-block d-sm-none d-md-block d-lg-none">
                {!!user && <MyChats/>}
                </div>
            </div>
           
            </div>
          
       </div>
    )
};
export default SideDrawer;