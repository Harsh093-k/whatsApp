import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const { authUser } = useSelector(store => store.user);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!authUser){
            navigate("/login");
        }
    },[])
  return <>{children}</>
}

export default ProtectedRoutes;