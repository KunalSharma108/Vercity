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
  const [render, setRender] = useState(false)
  const [Drafts, setDrafts] = useState([])

  useEffect(() => {
    const checkLogin = () => {
      let loggedIn = Cookies.get('loggedIn');
      if (!loggedIn) {
        setWarningDialogOpen(true);
        console.log('not logged in ')
      }
    };

    const fetchDrafts = () => {
      try {
        let response = axios.post(`${backendAPI}/getDrafts`, {}, { withCredentials: true, timeout: 10000 }).then((res) => {
          setDrafts(res.data.drafts);
          setRender(true)
        })
      } catch (error) {
        switch (error) {
          case 409:
          // TODO: Too tired to do the shit rn, will do it later.
        }
      }
    }

    if (index !== undefined) {
      fetchDrafts()
    } else {
      setRender(true)
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
    window.location.reload();
  }

  return (
    <div>
      <WarningDialog open={isWarningDialogOpen} handleClose={handleWarningCancel} handleLogIn={handleWarningLogIn} />
      <BlogDialog open={isBlogDialogOpen} Type={typeOfBlogDialog} handleClose={handleDialogClose} />
      <div className="flex w-full h-fit bg-base">
        <div className="w-1/4">
          <Sidebar navHeight={navHeight} screenHeight={screenHeight} Index={Drafts && index ? index : ''} render={render} />
        </div>
        <div className="w-3/4">
          <BlogContent DialogType={handleType} content={Drafts && index ? Drafts[index] : ''} index={Drafts && index ? index : ''} render={render} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlogMain