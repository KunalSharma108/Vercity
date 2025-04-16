import React, { useEffect, useState } from 'react'
import BlogContent from './BlogContent';
import Cookies from 'js-cookie';
import WarningDialog from './BlogWarning';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import BlogDialog from './BlogAction';
import axios from 'axios';
import backendAPI from '../API/backendAPI';

function CreateBlogMain({ navHeight, screenHeight }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { index } = useParams();
  const [isWarningDialogOpen, setWarningDialogOpen] = useState(false);
  const [isBlogDialogOpen, setBlogDialogOpen] = useState(false);
  const [typeOfBlogDialog, setTypeOfBlogDialog] = useState({});
  const [render, setRender] = useState(false);
  const [Drafts, setDrafts] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.post(`${backendAPI}/getDrafts`, {}, {
          withCredentials: true,
          timeout: 10000,
        });

        setDrafts(res.data.drafts);
        setRender(true);
      } catch (error) {

        if (error) {
          const status = error.response.status;
          if (status === 401 || status === 404) {
            alert('The draft doesn\'t exist');
            navigate('/CreateBlog');
          } else {
            alert('There was an error fetching the drafts');
          }
        } else if (error.code === 'ECONNABORTED') {
          alert('Request timed out, try again later.');
          navigate('/CreateBlog');
        } else {
          console.log('this one')
          alert('Something went wrong, try again.');
          navigate('/CreateBlog');
        }
        navigate('/CreateBlog');
      }
    }

    if (index) {
      fetchDrafts();
    } else {
      setTimeout(() => {
        setRender(true)
      }, 300);
    }

  }, [index]);

  const triggerLoading = () => {
    setRender(false);
    setTimeout(() => {
      setRender(true);
    }, 300);
  }

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
          <Sidebar navHeight={navHeight} DialogType={handleType} screenHeight={screenHeight} Index={Drafts && index ? index : false} render={render} triggerLoading={triggerLoading} />
        </div>
        <div className="w-3/4">
          <BlogContent DialogType={handleType} content={Drafts && index ? Drafts[index] : false} index={Drafts && index ? index : false} render={render} triggerLoading={triggerLoading} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlogMain