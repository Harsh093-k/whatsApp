import React from 'react';
import SendInput from './SendInput';
import Messages from './Messages';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MessageContainer = () => {
    const navigate=useNavigate();
  const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
  const dispatch = useDispatch();

  const isOnline = onlineUsers?.includes(selectedUser?._id);
  
  // Function to log "hello world"
  const div = async(selectedUserId) => {
    navigate(`/profile/${selectedUserId}`);
    
  };

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col flex-1 min-w-full md:min-w-[550px] h-full ">
          {/* Header */}
          <div className="flex items-center gap-3 bg-zinc-800 ml-5 text-white px-2 py-3 ">
            <div className={`avatar ${isOnline ? 'online' : ''}`}>
              <div
                className="w-10 md:w-12 rounded-full cursor-pointer"
                onClick={()=>div(selectedUser._id)} // Don't call the function immediately
              >
                <img src={selectedUser?.profilePhoto} alt="user-profile" />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-base md:text-lg font-semibold">{selectedUser?.username}</p>
            </div>
          </div>

          {/* Messages */}
          <Messages />

          {/* Send Input */}
          <SendInput />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center flex-1 min-w-full md:min-w-[550px] h-full bg-transparent px-4">
          <h1 className="text-3xl md:text-4xl text-white font-bold text-center">Hi, {authUser?.fullName}</h1>
          <h2 className="text-xl md:text-2xl text-white text-center mt-2">Let's start a conversation</h2>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
