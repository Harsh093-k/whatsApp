
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [authUser, navigate]);

  return (
    <>
    
      {isMobile ? (
        selectedUser ? (
          <div className="flex-1 w-full h-full">
            <MessageContainer />
          </div>
        ) : (
          <div className="flex w-screen h-screen ">
            <Sidebar/>
          </div>
        )
      ) : (
        <>
         <div className="flex  sm:h-[450px] md:h-[550px] overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <div className="w-[300px] h-full">
            <Sidebar />
          </div>
          <div className="flex-1 ">
            <MessageContainer />
          </div>
          </div>
        </>
      )}
  </>
  );
};

export default HomePage;
