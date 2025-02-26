import React, { useEffect, useState } from 'react'
import BlogContent from './BlogContent';
import Cookies from 'js-cookie';
import WarningDialog from './BlogWarning';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import BlogDialog from './BlogAction';

function CreateBlogMain({ navHeight, screenHeight }) {
  const navigate = useNavigate();
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

    checkLogin();
  }, []);

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
          <Sidebar navHeight={navHeight} screenHeight={screenHeight} />
        </div>
        <div className="w-3/4">
          <BlogContent DialogType={handleType}/>
        </div>
      </div>
    </div>
  )
}

export default CreateBlogMain
