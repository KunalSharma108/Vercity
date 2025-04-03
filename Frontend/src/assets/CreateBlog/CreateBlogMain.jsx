import React, { useEffect, useState } from 'react'
import BlogContent from './BlogContent';
import Cookies from 'js-cookie';
import WarningDialog from './BlogWarning';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
      }
    };

    const fetchDrafts = () => {
      try {
        let response = axios.post(`${backendAPI}/getDrafts`, {}, { withCredentials: true, timeout: 10000 }).then((res) => {
          if (res.status == 401) {
            alert('The draft doesnt exist');
            Navigate('/CreateBlog');
          } else if (res.status == 409) {
            alert('The draft doesnt exist');
            Navigate('/CreateBlog')
          }

          setDrafts(res.data.drafts);
          setRender(true)
        });
      } catch (error) {
        alert('There was an error');
        Navigate('/CreateBlog')
        switch (error) {
          case 409:
          alert('Unable to fetch drafts, pls try again later');
          
          default:
            alert('There was an error fetching');
        } 
      }
    }

    if (index) {
      fetchDrafts();
    } else {
      setTimeout(() => {
        setRender(true)
      }, 300);
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
          <Sidebar navHeight={navHeight} screenHeight={screenHeight} Index={Drafts && index ? index : false} render={render} />
        </div>
        <div className="w-3/4">
          <BlogContent DialogType={handleType} content={Drafts && index ? Drafts[index] : false} index={Drafts && index ? index : false} render={render} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlogMain