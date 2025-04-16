import axios from 'axios'
import React, { useEffect, useState } from 'react'
import backendAPI from '../API/backendAPI'

function Sidebar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${backendAPI}/GetUserData`, {}, {
          withCredentials: true,
          timeout: 30000
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className='w-full h-full flex items-center justify-between'>
      <div className="w-4/5 h-full p-2">
        Yo
      </div>
      <div className="w-[1px] h-full bg-[#45475A] self-center "></div>
    </div>
  )
}

export default Sidebar
