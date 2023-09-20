import {Button, Toast} from '@chakra-ui/react';
import './App.css';
import { Route } from 'react-router-dom';
import Home from './components/HomePage';
import Chat from './components/ChatPage';
function App() {
  return (
    <div className=" App">
     <Route path='/' exact component ={Home} />
     <Route path='/chats' component ={Chat} />
    </div>
  );
}

export default App;
