import React, { lazy, Suspense, useEffect, useState } from 'react'
const SignUpContent = lazy(() => import('./SignUpContent'));
import Cookies from 'js-cookie';
import WarningDialog from './WarningDialog';

function SignUp() {
  const [isDialogOpen, setDialogOpen] = useState(false);

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
  };

  const handleLogout = () => {
    setDialogOpen(false);
  };

  return (
    <div className="w-screen h-screen landscape-bg transition-colors duration-200 flex items-center justify-center">
      <WarningDialog open={isDialogOpen} handleClose={handleCloseDialog} handleLogout={handleLogout} />
      <Suspense fallback=''>
        <SignUpContent />
      </Suspense>
    </div>

  )
}

export default SignUp