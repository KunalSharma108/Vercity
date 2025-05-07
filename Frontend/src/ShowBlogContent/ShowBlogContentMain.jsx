import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Sidebar from '../assets/content/Sidebar';
import MainBar from './mainBar';

function ShowBlogContentMain(height) {
  return (
    <div className={`flex w-full h-full`}>

      <div className='w-1/4 h-full overflow-x-hidden overflow-y-auto'>
        <Sidebar />
      </div>

      <div className='w-3/4 h-full overflow-x-hidden overflow-y-auto'>
        <MainBar />
      </div>

    </div>

  );
}

export default ShowBlogContentMain;
