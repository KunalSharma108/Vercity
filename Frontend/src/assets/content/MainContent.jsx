import axios from 'axios';
import React, { useEffect, useState } from 'react';
import backendAPI from '../API/backendAPI';
import Sidebar from './Sidebar';
import MiddleBar from './MiddleBar';

function MainContent(height) {
  return (
    <div className={`flex mt-[${height}] w-full h-full`}>

      <div className='w-1/4 h-full overflow-x-hidden overflow-y-auto'>
        <Sidebar />
      </div>

      <div className='w-3/4 h-full overflow-x-hidden overflow-y-auto'>
        <MiddleBar />
      </div>

    </div>

  );
}

export default MainContent;
