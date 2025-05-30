import React, { lazy, Suspense, useEffect, useState } from 'react'
const LogInContent = lazy(() => import('./LogInContent'));
import Cookies from 'js-cookie';
import WarningDialog from '../WarningDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendAPI from '../../API/backendAPI';

function LogIn() {
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      let loggedIn = Cookies.get('loggedIn');
      if (loggedIn) {
        setDialogOpen(true);
      }
    };

    checkLogin();
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate('/');
  };

  const handleLogout = async () => {
    let result = await axios.post(`${backendAPI}/LogOut`, {}, {
      withCredentials: true,
    }).then(response => {
      if (response.status == 201) {
        setDialogOpen(false);
        Cookies.remove('loggedIn')
      } else {
        window.alert('There was a problem in trying to log out.')
        setDialogOpen(false)
        navigate('/')
      }
    })
  };

  return (
    <div className="w-screen h-screen landscape-bg transition-colors duration-200 flex items-center justify-center overflow-hidden">
      <WarningDialog
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        handleLogout={handleLogout}
        LoggingOut={isLoggingOut}
        userState={'Log In'} />
      <Suspense fallback=''>
        <LogInContent />
      </Suspense>
    </div>
  )
}

export default LogIn
