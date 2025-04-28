import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector(store => store.message);

  return (
    <div className="flex flex-col gap-4 px-2 md:px-4 py-2 flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
      {messages && messages.map(message => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
