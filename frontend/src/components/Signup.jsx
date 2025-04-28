import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';


const Signup = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, gender } = user;

    if (!username || !email || !password || !confirmPassword || !gender) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('gender', gender);
      if (profilePhoto) {
        formData.append('file', profilePhoto); 
      }

      const res = await axios.post(`${BASE_URL}/api/v1/user/register?type=image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };
 
  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Signup</h1>
        
          <form onSubmit={handleSubmit} className='w-full'>
            <div>
          <label className='label p-2'>
              <span className='text-base label-text'>UserName</span>
            </label>
          <input name="username" type="text" placeholder="Username" className="w-full input input-bordered h-10" value={user.username} onChange={handleChange} />
          </div>
          <div><label className='label p-2'>
              <span className='text-base label-text'>Email</span>
            </label>
          <input name="email" type="email" placeholder="Email" className="w-full input input-bordered h-10" value={user.email} onChange={handleChange} />
          </div><div> <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
          <input name="password" type="password" placeholder="Password" className="w-full input input-bordered h-10" value={user.password} onChange={handleChange} />
          </div><div> <label className='label p-2'>
              <span className='text-base label-text'>Confirm Password</span>
            </label>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full input input-bordered h-10" value={user.confirmPassword} onChange={handleChange} />
          </div><div><label className='label p-2'>
              <span className='text-base label-text'>Gender</span>
            </label>
          <select name="gender" className="w-full input input-bordered h-10" value={user.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select></div>
          <div>
          <label className='label p-2'>
              <span className='text-base label-text'>ProfilePhoto</span>
            </label>
          <input type="file" onChange={handleFileChange} className="file-input w-full input input-bordered h-10" />
          </div>
          <button type="submit" className="btn btn-block btn-primary">Register</button>
        </form>
        <p>I have a already Account <Link to="/login">login</Link></p>
      </div>
    </div>
  )
}

export default Signup