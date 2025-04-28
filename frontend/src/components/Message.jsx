import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '..';
import toast from 'react-hot-toast';
import { removeMessage, updateMessage } from '../redux/messageSlice';

const Message = ({ message }) => {
    const scroll = useRef();
    const dispatch = useDispatch();
    const { authUser, selectedUser } = useSelector(store => store.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedText, setEditedText] = useState(message.message);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const isOwnMessage = message?.senderId === authUser?._id;
    const profilePhoto = isOwnMessage ? authUser?.profilePhoto : selectedUser?.profilePhoto;

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const handleEditMessage = async() => {
        setEditedText(message.message);
        
        setEditModalOpen(true);
        setMenuOpen(false);
    };

    const handleUpdateMessage = async () => {
        const messageId = message._id;
        try {
            const res = await axios.put(`${BASE_URL}/api/v1/message/edit/${messageId}`, {
                message: editedText
            }, { withCredentials: true });
            
            toast.success(res.data.message);
            dispatch(updateMessage({
                messageId: message._id,
                newMessage: editedText
              }));
              

            setEditModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Edit failed");
        }
    };
    

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(message.message);
        toast.success("Message copied!");
    };

    const handleDeleteMessage = async () => {
        const messageId = message._id;
        try {
            const res = await axios.delete(`${BASE_URL}/api/v1/message/delete/${messageId}`, {
                withCredentials: true
            });
            toast.success(res?.data.message);
            dispatch(removeMessage(messageId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    
    

    return (
        <>
            <div ref={scroll} className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'} relative`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full"  >
                        <img alt="User avatar" src={profilePhoto} />
                    </div>
                </div>
                <div className="chat-header flex justify-between items-center gap-2 w-full pr-10">
                    <div className="relative m-auto">
                        {menuOpen && (
                            <ul className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded shadow-lg text-sm z-50">
                                <li className="hover:bg-gray-100 px-3 py-1 cursor-pointer" onClick={handleEditMessage}>Edit</li>
                                <li className="hover:bg-gray-100 px-3 py-1 cursor-pointer" onClick={handleCopyMessage}>Copy</li>
                                <li className="hover:bg-gray-100 px-3 py-1 cursor-pointer" onClick={handleDeleteMessage}>Delete</li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className={`chat-bubble ${!isOwnMessage ? 'bg-gray-200 text-black' : ''}`} onClick={toggleMenu}>
    {message?.message}
</div>

                <time className="text-xs opacity-50 text-white">
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </time>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-2">Edit Message</h2>
                        <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-black px-4 py-1 rounded"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-1 rounded"
                                onClick={handleUpdateMessage}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Message;
