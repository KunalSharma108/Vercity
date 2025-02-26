import axios from 'axios';
import React, { useEffect, useState } from 'react';
import backendAPI from '../API/backendAPI';

function MainContent(height) {
  const [data, setData] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendAPI}`); 
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error); // Handle any errors
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <h2>The result is</h2> 
      ) : (
        <h1>Loading......</h1>
      )}
    </div>
  );
}

export default MainContent;
