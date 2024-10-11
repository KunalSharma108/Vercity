import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import axios from 'axios'
import backendAPI from './assets/API/backendAPI';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './assets/Navbar/Navbar';
const SignUp = lazy(() => import('./assets/User/SignUp/SignUp'))
const LogIn = lazy(() => import('./assets/User/LogIn/logIn'));
const MainContent = lazy(() => import('./assets/content/MainContent'))

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false)

  // useEffect to calculate and set the navbar's height
  useEffect(() => {
    const handleResize = async () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight); // dynamically get navbar height
      }
    };

    // Call the function initially and also on window resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [navRef]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={(
          <>
            <div className="bg-base text-neutral h-screen">
              <Navbar navRef={navRef} loggedIn={loggedIn} />

              <div className="h-full" style={{ paddingTop: `${navHeight}px` }}>
                <Suspense fallback='Loading my nigga'>
                  <MainContent height={navHeight} />
                </Suspense>
              </div>

            </div>
          </>
        )} />

        <Route path='/SignUp' element={(
          <>
            <div className='bg-base w-screen h-screen'>
              <Suspense fallback=''>
                <SignUp />
              </Suspense>
            </div>
          </>
        )} />

        <Route path='/LogIn' element={(
          <>
            <div className='bg-base w-screen h-screen'>
              <Suspense fallback=''>
                <LogIn />
              </Suspense>
            </div>
          </>
        )} />
      </Routes>
    </Router>
  );
}

export default App;

