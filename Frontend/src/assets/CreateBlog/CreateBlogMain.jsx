import React, { useEffect, useState } from 'react'
import BlogContent from './BlogContent';
import Cookies from 'js-cookie';
import WarningDialog from './BlogWarning';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import BlogDialog from './BlogAction';
import axios from 'axios';
import backendAPI from '../API/backendAPI';

function CreateBlogMain({ navHeight, screenHeight }) {
  const navigate = useNavigate();
  const { index } = useParams();
  const [isWarningDialogOpen, setWarningDialogOpen] = useState(false);
  const [isBlogDialogOpen, setBlogDialogOpen] = useState(false);
  const [typeOfBlogDialog, setTypeOfBlogDialog] = useState({});

  useEffect(() => {
    const checkLogin = () => {
      let loggedIn = Cookies.get('loggedIn');
      if (!loggedIn) {
        setWarningDialogOpen(true);
        console.log('not logged in ')
      }
    };

    const fetchDrafts = () => {
      // let response = axios.post(`${backendAPI}/getDrafts`, {}, { withCredentials: true, timeout: 10000 }).then((res) => {

      // })

      console.log('fetching')
    }

    if (index !== undefined) {
      fetchDrafts()
    }

    checkLogin();
  }, [index]);

  const handleWarningCancel = () => {
    setWarningDialogOpen(false);
    navigate('/');
  }

  const handleWarningLogIn = () => {
    setWarningDialogOpen(false);
    navigate('/LogIn');
  }

  const handleType = (payload) => {
    if (payload) {
      setTypeOfBlogDialog(payload)
      setBlogDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setBlogDialogOpen(false)
    setTypeOfBlogDialog({})
  }

  return (
    <div>
      <WarningDialog open={isWarningDialogOpen} handleClose={handleWarningCancel} handleLogIn={handleWarningLogIn} />
      <BlogDialog open={isBlogDialogOpen} Type={typeOfBlogDialog} handleClose={handleDialogClose} />
      <div className="flex w-full h-fit bg-base">
        <div className="w-1/4">
          <Sidebar navHeight={navHeight} screenHeight={screenHeight} index={index} />
        </div>
        <div className="w-3/4">
          <BlogContent DialogType={handleType} index={index} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlogMain
