import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserEdit, FaPhoneAlt, FaCommentDots } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { setSelectedUser } from '../redux/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { TiUpload } from "react-icons/ti";
import { BASE_URL } from '..';
import useGetOtherUsers from '../hooks/useGetOtherUsers';

const AuthUserProfilePage = () => {
    const [authUser, setAuthUser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [biodata, setBio] = useState();

    const [openEdit, setOpenEdit] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isFileInputVisible, setFileInputVisible] = useState(false); // State to control file input visibility
    const [videoFile, setVideoFile] = useState(null); // State to store the selected video file
    const [file, setFile] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    const hasStatus = authUser?.status && authUser.status.trim() !== '';

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };
    const playStatusHandler = (e, authUser) => {
        e.stopPropagation();
        console.log(authUser._id)
        if (authUser?.status && authUser.status.trim() !== '') {
            setShowVideo(true);
        }
    };

    const closeVideoHandler = () => {
        setShowVideo(false);
    };
    const handleUpload = async () => {
        if (!file) {
            return; // No file selected
        }

        console.log('Uploading:', file);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${BASE_URL}/api/v1/user/addstatus?type=reel`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            toast.success(response.data.message);
            console.log(response.data);
            setFileInputVisible(false); // Close the file input after uploading
        } catch (error) {
            toast.error("Error uploading video.");
            console.error(error);
        }
    };



    const handleMessage = () => {
        // Toggle file input visibility for video status
        setFileInputVisible(!isFileInputVisible);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
               
                
                 const   res = await axios.get('http://localhost:8080/api/v1/user/me', {
                        withCredentials: true,
                    });
                    setAuthUser(res.data.userdata);
                    console.log("autherUser",res.data);
               
            } catch (error) {
                console.log(error);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        fetchData();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEdit = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/AddBio`, { biodata }, {
                withCredentials: true
            });
            toast.success(res.data.message);
            setAuthUser(res.data.userdata);
            setOpenEdit(false);
            setBio("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating bio");
        }
    };

    return (
        <>
           <div className="flex m-0 md:h-[550px] overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
  {!isMobile && (
    <div className="w-[300px] h-full">
      <Sidebar />
    </div>
  )}


                <div className="flex flex-col flex-1 sm:w-full md:min-w-[550px] h-full px-4 py-6 mt-0 text-white" >
                    <div className="avatar mb-4 mx-auto" onClick={(e) => playStatusHandler(e, authUser)}>
                        <div className="w-28 h-28 rounded-full ring ring-gray-500 ring-offset-base-100 ring-offset-2 overflow-hidden">
                            <img src={authUser?.profilePhoto} alt="Profile" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center">{authUser?.username}</h2>
                    <p className="text-sm text-green-300 text-center">@{authUser?.email}</p>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        {authUser?.bio || "Hey there! I'm using ChatApp."}
                    </p>

                    <div className="flex gap-4 mt-4 mx-auto overflow-x-auto flex-nowrap">
                        <button onClick={() => setOpenEdit(true)} className="btn btn-sm  bg-gray-700 hover:bg-gray-600 text-white flex items-center">
                            <FaUserEdit className="mr-1 " /> Edit
                        </button>
                        <button className="btn btn-sm bg-gray-700 hover:bg-gray-600 text-white flex items-center">
                            <FaPhoneAlt className="mr-1" /> Call
                        </button>
                        <button className="btn btn-sm bg-gray-700 hover:bg-gray-600 text-white flex items-center" onClick={() => dispatch(setSelectedUser(null)) && navigate("/")}>
                            <FaCommentDots className="mr-1" /> Message
                        </button>
                        <button className="btn btn-sm bg-gray-700 hover:bg-gray-600 text-white flex items-center" onClick={()=>handleMessage}>
                            <TiUpload className="mr-1" /> Status
                        </button>
                    </div>
                    {openEdit &&

                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-black p-6 rounded-lg shadow-lg w-96 relative text-black">
                                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                                <p className="text-gray-600 mb-4">Here you can edit your profile information.</p>

                                <button
                                    onClick={() => setOpenEdit(false)}
                                    className="absolute top-2 right- text-gray-600 hover:text-black"
                                >
                                    ✖
                                </button>


                                <input
                                    type="text"
                                    placeholder="Enter your new bio..."
                                    className="border border-gray-300 p-2 w-full rounded mb-4"
                                    name="biodata"
                                    value={biodata}
                                    onChange={(e) => setBio(e.target.value)}
                                />


                                <button
                                    onClick={handleEdit}
                                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>

                            </div>
                        </div>


                    }

                    {isFileInputVisible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-black p-6 rounded-lg shadow-lg w-96 relative text-white">
                                <h2 className="text-xl font-bold mb-4">Upload Media for Status</h2>
                                <button onClick={() => setFileInputVisible(false)} className="absolute top-2 right-2 text-white">
                                    ✖
                                </button>

                                {/* File Input to accept both video and image */}
                                <input
                                    type="file"
                                    accept="image/*, video/*"
                                    onChange={handleFileChange}
                                    className="mt-2 w-full text-gray-600"
                                />

                                {/* Display preview of selected file */}
                                {file && (
                                    <div className="mt-2">
                                        {/* If the selected file is a video */}
                                        {file.type.startsWith('video') ? (
                                            <video controls className="w-full h-64 bg-black rounded-lg">
                                                <source src={URL.createObjectURL(file)} type={file.type} />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            // If it's an image
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-64 object-contain bg-gray-200 rounded-lg" />
                                        )}

                                        <button
                                            onClick={handleUpload}
                                            className="btn btn-sm bg-blue-500 hover:bg-blue-400 text-white mt-2"
                                        >
                                            Upload {file.type.startsWith('video') ? 'Video' : 'Image'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Video Modal */}
                   

                </div>
            </div>
            {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center m-auto z-50 h-full w-full">
          <div className="relative bg-white p-4 rounded-lg">
            <button
              onClick={closeVideoHandler}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <video
              src={authUser?.status}
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

export default AuthUserProfilePage;
