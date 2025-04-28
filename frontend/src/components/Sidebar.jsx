import React, { useState, useEffect } from 'react';
import { BiSearchAlt2, BiDotsVerticalRounded } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showOptions, setShowOptions] = useState(false);
    const { otherUsers , authUser} = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    };

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        console.log("otherUsers", otherUsers);
        console.log("search input", search);
        
        if (!search.trim()) {
            toast.error("Please enter something to search!");
            return;
        }
    
        const keyword = search.trim().toLowerCase();
    
        const conversationUser = otherUsers?.find((user) => {
            const username = user?.username?.toLowerCase() || "";
            return username.includes(keyword);
        });
    
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
            setSearch(''); // <-- move it here after finding user
        } else {
            toast.error("User not found!");
        }
    };
    

    return (
        <div className={`flex flex-col bg-none md:bg-transparent border-r border-slate-500 p-4
            ${isMobile ? "w-full h-full" : "w-80 h-full"}`}>

            {/* Top Section */}
            <div className="flex items-center justify-between mb-4 bg-none">
                <h1 className="text-lg font-bold text-gray-700">Chats</h1>
                <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-2 rounded-md hover:bg-gray-200"
                    >
                        <BiDotsVerticalRounded className="w-6 h-6 text-gray-700" />
                    </button>
                
                
            </div>

            {/* Options Dropdown */}
            {showOptions && (
                <div className="absolute top-16 right-6 bg-white shadow-lg rounded-md p-2 z-50 flex flex-col gap-2 text-sm">
                    <button onClick={() => navigate(`/profile/me`)} className="hover:bg-gray-100 px-3 py-2 rounded">Profile</button>
                    <button onClick={() => navigate('/settings')} className="hover:bg-gray-100 px-3 py-2 rounded">Settings</button>
                    <button onClick={logoutHandler} className="hover:bg-red-100 px-3 py-2 rounded text-red-600">Logout</button>
                </div>
            )}

            {/* Search Input */}
            <form onSubmit={searchSubmitHandler} className="flex items-center gap-2 mb-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Search..."
                />
                <button
                    type="submit"
                    className="p-2 rounded-md bg-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center"
                >
                    <BiSearchAlt2 className="w-5 h-5" />
                </button>
            </form>

            {/* Other Users List */}
            <div className="flex-1 overflow-y-auto">
                <OtherUsers />
            </div>

            {/* Logout Button (Desktop only) */}
            {!isMobile && (
                <div className="mt-4">
                    <button
                        onClick={logoutHandler}
                        className="w-full py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
