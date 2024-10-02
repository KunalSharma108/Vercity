import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import backendAPI from './assets/API/backendAPI';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './assets/Navbar/Navbar';

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(true)

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
    <div className="bg-base text-neutral h-screen">
      <Router>
        <Routes>
          <Route path='/' element={(
            <>
              <Navbar navRef={navRef} loggedIn={loggedIn} />
            </>
          )} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

