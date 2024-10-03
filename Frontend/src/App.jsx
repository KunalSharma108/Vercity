import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import backendAPI from './assets/API/backendAPI';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './assets/Navbar/Navbar';
import SignUp from './assets/User/SignUp';
import LogIn from './assets/User/logIn';

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false)

  // useEffect to calculate and set the navbar's height
  useEffect(() => {
    const handleResize = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight); // dynamically get navbar height
      }
    };

    // Call the function initially and also on window resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={(
          <>
            <div className="bg-base text-neutral h-screen">
              <Navbar navRef={navRef} loggedIn={loggedIn} />
            </div>
          </>
        )} />

        <Route path='/SignUp' element={(
          <>
            <SignUp />
          </>
        )} />

        <Route path='/LogIn' element={(
          <>
            <LogIn />
          </>
        )} />
      </Routes>
    </Router>
  );
}

export default App;

