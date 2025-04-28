import { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/user`, { withCredentials: true });
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.error('Error fetching other users:', error.response?.data?.message || error.message);
            }
        };
        fetchOtherUsers();
    }, [dispatch]);
};

export default useGetOtherUsers;
