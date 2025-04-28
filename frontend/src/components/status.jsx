import React, { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";

export default function StatusPlayer() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [status,setStatus]=useState();
  const id=useParams();
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            let res;
            if (id) {
                res = await axios.get(`http://localhost:8080/api/v1/user/profile/${id}`, {
                    withCredentials: true,
                });
                setStatus(res.data.userdata.status);
            }
        } catch (error) {
            console.log(error);
        }
    };
    fetchData()
    if (status.type === "image") {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
          
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const handleEnd = () => {
    // Handle end viewing
    console.log("Ended Status");
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log("Deleted Status");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="relative bg-black rounded-2xl shadow-lg overflow-hidden w-full max-w-md p-4">
        {status.type === "image" ? (
          <img
            src={status.url}
            alt="status"
            className="w-full h-96 object-cover rounded-xl"
          />
        ) : (
          <video
            ref={videoRef}
            src={status.url}
            controls
            autoPlay
            className="w-full h-96 object-cover rounded-xl"
          />
        )}

        {/* Timer for image */}
        {status.type === "image" && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {timeLeft}s left
          </div>
        )}

        {/* Controls for video */}
        {status.type === "video" && (
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={handleEnd} className="bg-blue-500 hover:bg-blue-600 rounded-xl">
              End
            </button>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 rounded-xl">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
