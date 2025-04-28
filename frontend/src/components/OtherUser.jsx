// import React from 'react';
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedUser } from '../redux/userSlice';
// import { useNavigate } from 'react-router-dom';

// const OtherUser = ({ user }) => {
//     const navigate=useNavigate()
//   const dispatch = useDispatch();
//   const { selectedUser, onlineUsers } = useSelector(store => store.user);
//   const isOnline = onlineUsers?.includes(user._id);

//   const selectedUserHandler = (user) => {
//     dispatch(setSelectedUser(user));
//     navigate('/');
//   };

//   return (
//     <>
//       <div
//         onClick={() => selectedUserHandler(user)}
//         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
//           ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'}
//           hover:bg-zinc-200 hover:text-black`}
//        >
//         <div className={`avatar ${isOnline ? 'online' : ''}`}>
//           <div className="w-10 md:w-12 rounded-full">
//             <img src={user?.profilePhoto} alt="user-profile" />
//           </div>
//         </div>

//         <div className="flex flex-col flex-1">
//           <div className="flex justify-between items-center">
//             <p className="text-sm md:text-base font-medium truncate">{user?.username}</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="divider my-0 py-0 h-1" />
//     </>
//   );
// };

// export default OtherUser;

// import React from 'react';
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedUser } from '../redux/userSlice';
// import { useNavigate } from 'react-router-dom';

// const OtherUser = ({ user }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { selectedUser, onlineUsers } = useSelector(store => store.user);
//   const isOnline = onlineUsers?.includes(user._id);

//   // Check if status exists and is not empty
//   const hasStatus = user?.status && user.status.trim() !== '';

//   const selectedUserHandler = (user) => {
//     dispatch(setSelectedUser(user));
//     navigate('/');
//   };
  
  
//   const playStatusHandler = (e, user) => {
//     e.stopPropagation(); // Stop the parent div's onClick from firing
//     if (user?.status && user.status.trim() !== '') {
//       // Here you can either navigate to a status page or open a video player
//       console.log('Play status video:', user.status);
//       // Example: navigate(`/status/${user._id}`);
//       // OR: open a modal to play video
//     } else {
//       console.log('No status available');
//     }
//   };
//   return (
//     <>
//       <div
//         onClick={() => selectedUserHandler(user)}
//         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
//           ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'}
//           hover:bg-zinc-200 hover:text-black`}
//       >
//         <div className={`avatar ${isOnline ? 'online' : ''}`} onClick={(e) => playStatusHandler(e, user)}>
//           <div
//             className={`w-10 md:w-12 rounded-full ${hasStatus ? 'border-4 border-double' : ''}`}
//           >
//             <img src={user?.profilePhoto} alt="user-profile" />
//           </div>
//         </div>

//         <div className="flex flex-col flex-1">
//           <div className="flex justify-between items-center">
//             <p className="text-sm md:text-base font-medium truncate">{user?.username}</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="divider my-0 py-0 h-1" />
//     </>
//   );
// };

// export default OtherUser;
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const OtherUser = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector(store => store.user);
  const isOnline = onlineUsers?.includes(user._id);

  const [showVideo, setShowVideo] = useState(false);

  const hasStatus= user?.status && user.status.trim() !== '';

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    navigate('/');
  };

  const playStatusHandler = (e, user) => {
    e.stopPropagation();
    console.log(user._id)
    if (user?.status && user.status.trim() !== '') {
      setShowVideo(true); 
    }
  };

  const closeVideoHandler = () => {
    setShowVideo(false);
  };

  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
          ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'}
          hover:bg-zinc-200 hover:text-black`}
      >
        <div className={`avatar ${isOnline ? 'online' : ''}`} onClick={(e) => playStatusHandler(e, user)}>
          <div
            className={`w-10 md:w-12 rounded-full ${hasStatus ? 'border-4 border-double' : ''}`}
          >
            <img src={user?.profilePhoto} alt="user-profile" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm md:text-base font-medium truncate">{user?.username}</p>
          </div>
        </div>
      </div>
      
      <div className="divider my-0 py-0 h-1" />

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center m-auto z-50 h-1/2 w-1/2">
          <div className="relative bg-white p-4 rounded-lg">
            <button
              onClick={closeVideoHandler}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <video
              src={user?.status}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OtherUser;
