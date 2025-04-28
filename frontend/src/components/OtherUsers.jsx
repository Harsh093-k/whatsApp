import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';

const OtherUsers = () => {
  // Fetch other users with custom hook
  useGetOtherUsers();
  const { otherUsers } = useSelector(store => store.user);

  if (!otherUsers) return null; // Early return (better to return null)

  return (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1 max-h-[calc(100vh-200px)] p-2">
      {otherUsers.map(user => (
        <OtherUser key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers;
