import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
import ProfilePage from './components/profilePage';
import StatusPlayer from './components/status';
import AuthUserProfilePage from './components/authprofilepage';
import ProtectedRoutes from './components/ProtectedRoutes';


const router = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><HomePage/></ProtectedRoutes>
  },
  {
    path:'/profile/:id',
    element:<ProtectedRoutes><ProfilePage/></ProtectedRoutes>
  },
  {
    path:'/profile/me',
    element:<ProtectedRoutes><AuthUserProfilePage/></ProtectedRoutes>
  },
  {
    path:'/status/:id',
    element:<ProtectedRoutes><StatusPlayer/></ProtectedRoutes>
  },
  
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },

])

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(authUser){
      const socketio = io(`${BASE_URL}`, {
          query:{
            userId:authUser._id
          }
      });
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () => socketio.close();
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }

  },[authUser]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router}/>
     
    </div>

  );
}

export default App;
