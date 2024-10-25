import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import backendAPI from './assets/API/backendAPI';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './assets/Navbar/Navbar';
import Loading from './templates/loading';
import Offline from './templates/offline';
const SignUp = lazy(() => import('./assets/User/SignUp/SignUp'));
const LogIn = lazy(() => import('./assets/User/LogIn/logIn'));
const MainContent = lazy(() => import('./assets/content/MainContent'));
import Cookies from 'js-cookie';

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState('loading');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        let request = await axios.post(`${backendAPI}/verifyCookie`, {}, {
          withCredentials: true,
        });
        setLoading('loadingDone');
        setLoggedIn(request.data.loggedIn);
        setTimeout(() => {
          setLoading(true);
        }, 500);

        Cookies.set('loggedIn', request.data.loggedIn);

      } catch (error) {
        if (Cookies.get('loggedIn')) {
          Cookies.remove('loggedIn')
        }
        setLoading('loadingDone');
        setTimeout(() => {
          setLoading(true);
        }, 500);
      }
    };

    const handleResize = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    checkLogin();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [navRef, location.pathname]); // Add location.pathname as a dependency

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <div className="bg-base text-neutral h-screen">
            {loading === 'loading' ? (
              <Loading class='' />
            ) : loading === true ? (
              <>
                <Navbar navRef={navRef} loggedIn={loggedIn} />
                <div className="h-full" style={{ paddingTop: `${navHeight}px` }}>
                  <Suspense fallback='Loading my nigga'>
                    <MainContent height={navHeight} />
                  </Suspense>
                </div>
              </>
            ) : loading === 'loadingDone' ? (
              <Loading class='startAnimation' />
            ) : (
              <Offline />
            )}
          </div>
        } />

        <Route path='/SignUp' element={(
          <div className='bg-base w-screen h-screen'>
            <Suspense fallback=''>
              <SignUp />
            </Suspense>
          </div>
        )} />

        <Route path='/LogIn' element={(
          <div className='bg-base w-screen h-screen'>
            <Suspense fallback=''>
              <LogIn />
            </Suspense>
          </div>
        )} />
      </Routes>
    </Router>
  );
}

export default App;

// TODO: implement the same warning feature in log in and setup login too