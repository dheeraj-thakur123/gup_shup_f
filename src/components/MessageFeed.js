import ScrollableFeed from 'react-scrollable-feed';
import {ChatState} from '../context/chatProvider';
import {Avatar,Tooltip} from '@chakra-ui/react';

const ScrollableText = ({allmessages})=>{
  const {user,token,setMyChats,myChats,selectedChat} = ChatState();
return(<>
    <ScrollableFeed>
    {allmessages?.map(val=>{
      return (
        <div style={{ display: "flex" }} key={val._id}>
            {(val.sender._id!=user._id)
              && (
              <Tooltip label={val.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={val.sender.name}
                  src={val.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  val.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: val.sender._id===user._id?'auto':0,
                marginTop: val.sender._id===user._id ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {val.content}
            </span>
          </div>
        // <div key={val._id} className="" style={{display:'flex'}}>
        //   {val.sender._id!=user._id && <Avatar mr={1} mt="9px" size='sm' name={val.sender.name} src={val.sender.pic} className=""/>}
        //   <span style={{'backgroundColor':val.sender._id===user._id?'#90caf9':"#00f16b8c",marginLeft:val.sender._id===user._id?'auto':0,marginTop:val.sender._id===user._id ? 3 : 10,  borderRadius: "20px",padding: "5px 15px", maxWidth: "75%"}} className=''> {val.content}</span>
        // </div>
      )
    })}
  </ScrollableFeed>
 
  </>
)
};
export default ScrollableText;
