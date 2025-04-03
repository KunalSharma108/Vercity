import { useLayoutEffect, useRef, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import backendAPI from './assets/API/backendAPI';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './assets/Navbar/Navbar';
import Loading from './templates/loading';
import Offline from './templates/offline';
const SignUp = lazy(() => import('./assets/User/SignUp/SignUp'));
const LogIn = lazy(() => import('./assets/User/LogIn/logIn'));
const MainContent = lazy(() => import('./assets/content/MainContent'));
import CreateBlogMain from './assets/CreateBlog/CreateBlogMain';
import Cookies from 'js-cookie';
import React from 'react';

function App() {
  const navRef = useRef(null);
  const screenRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState('loading');

  useLayoutEffect(() => {
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

      if (screenRef.current) {
        setScreenHeight(screenRef.current.clientHeight)
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    checkLogin();

    const intervalId = setInterval(() => {
      handleResize();
    }, 20);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    }

  }, [navRef, location.pathname]); 

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <div className="bg-base text-neutral h-screen">
            {loading === 'loading' ? (
              <Loading class='' />
            ) : loading === true ? (
              <>
                <Navbar navRef={navRef} loggedIn={loggedIn} path={''} />
                <div className="h-full" style={{ paddingTop: `${navHeight}px` }}>
                  <Suspense fallback={<Loading class='startAnimation' />}>
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
          <div className='bg-base text-neutral w-screen h-screen'>
            <Suspense fallback={<Loading class='startAnimation' />}>
              <SignUp />
            </Suspense>
          </div>
        )} />

        <Route path='/LogIn' element={(
          <div className='bg-base text-neutral w-screen h-screen'>
            <Suspense fallback={<Loading class='startAnimation' />}>
              <LogIn />
            </Suspense>
          </div>
        )} />

        <Route path='/CreateBlog' element={(
          <div className={`bg-base text-neutral h-screen`} ref={screenRef}>
            <>
              <Navbar navRef={navRef} loggedIn={loggedIn} path={'CreateBlog'} />
              <div className='h-fit bg-base' style={{ paddingTop: `${navHeight}px` }}>
                <CreateBlogMain navHeight={navHeight} screenHeight={screenHeight} />
              </div>
            </>
          </div>
        )} />

        <Route path='/CreateBlog/Draft/:index' element={(
          <div className={`bg-base text-neutral h-screen`} ref={screenRef}>
            <>
              <Navbar navRef={navRef} loggedIn={loggedIn} path={'CreateBlog'} />
              <div className='h-fit bg-base' style={{ paddingTop: `${navHeight}px` }}>
                <CreateBlogMain navHeight={navHeight} screenHeight={screenHeight} />
              </div>
            </>
          </div>
        )} />

      </Routes>
    </Router>
  );
}

export default App;





// create a way from which if the drafts dont exist it will show a default text of "No drafts"