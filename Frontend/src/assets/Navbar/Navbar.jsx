import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faArrowRightFromBracket, faRightToBracket, faUserPlus, faHouse } from '@fortawesome/free-solid-svg-icons';
import Vercity from '../images/Vercity-logo.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendAPI from '../API/backendAPI';
import Cookies from 'js-cookie';

function Navbar({ navRef, loggedIn, path}) {
  const navigate = useNavigate();
  const [shadowState, setShadowState] = useState('');

  const handleSignOut = async () => {
    let result = await axios.post(`${backendAPI}/LogOut`, {}, {
      withCredentials: true,
    }).then(response => {
      if (response.status == 201) {
        Cookies.remove('loggedIn');
        Cookies.remove('auth_token');
        navigate('/')
        window.location.reload();
      } else {
        window.alert('There was a problem in trying to log out.')
        navigate('/')
      }
    })
  }

  return (
    <nav ref={navRef} className='bg-base backdrop-blur-md bg-opacity-80 w-screen py-2 flex items-center justify-between fixed shadow-even-md shadow-black'>
      <div className="flex-none w-1/4 flex item-center justify-center"> {/* 25% for logo */}
        <img
          src={Vercity}
          alt=""
          className='filter brightness-125 contrast-100 hover:grayscale-0 transition duration-300 h-14 cursor-pointer'
          onClick={() => navigate('/')}
        />
      </div>

      <div className="flex-none w-1/4 mx-8 px-2"> {/* 25% for links */}
        <div className="flex items-center justify-around space-x-4">

          {loggedIn ? (

            <>
              {path == 'CreateBlog' ? (
                <>
                  <Link to={'/'} className={`text-lg text-neutral flex items-center justify-center text-center rounded-md font-Lato ${loggedIn ? 'outline outline-2 outline-primary shadow-primary hover:shadow-even-lg hover:shadow-primary transition-colors duration-300 cursor-pointer hover:bg-primary hover:text-[#1E1E2E] rounded-sm py-2 px-3 box-border outline-offset-0' : 'cursor-not-allowed text-gray-400 pointer-events-none select-none opacity-50'}`}>
                    <FontAwesomeIcon icon={faHouse} className='mr-2 text-2xl' />
                    <div className='text-xl'>Home</div>
                  </Link>
                </>
              ) : (
                <>
                    <Link to={'/CreateBlog'} className={`text-lg text-neutral flex items-center justify-center text-center rounded-md font-Lato ${loggedIn ? 'outline outline-2 outline-primary shadow-primary hover:shadow-even-lg hover:shadow-primary transition-colors duration-300 cursor-pointer hover:bg-primary hover:text-[#1E1E2E] rounded-sm py-2 px-3 box-border outline-offset-0' : 'cursor-not-allowed text-gray-400 pointer-events-none select-none opacity-50'}`}>
                    <FontAwesomeIcon icon={faPlus} className='mr-2 text-2xl' />
                    <div>Create Blog</div>
                  </Link>
                </>

              )}


              <div onClick={handleSignOut} className="text-lg text-[#1E1E2E] flex items-center justify-center text-center bg-red-500 outline outline-2 rounded-sm outline-red-500 shadow-red-500 shadow-even-sm font-Lato hover:shadow-even-lg hover:shadow-red-500 duration-300 cursor-pointer hover:bg-transparent hover:text-neutral py-2 px-3 font-extrabold">
                <FontAwesomeIcon icon={faArrowRightFromBracket} className='mr-2 text-2xl' />
                <div className='flex items-center justify-center text-md w-full h-full hover:shadow-lg'
                  onClick={handleSignOut}>
                  Sign Out
                </div>
                {/* When the user is logged in only the Sign out button along with Create Blog button is visible */}
              </div>
            </>

          ) : (
            <>
              {/* When the user is not Logged in Log in and Sign in button visible along with Create blog but is disabled ofc */}

              <div className="shadow-mg">
                <Link to={'/LogIn'} className="text-lg text-neutral flex items-center justify-center text-center outline outline-2  outline-primary shadow-primary shadow-sm font-Lato hover:shadow-even-lg hover:shadow-primary duration-300 cursor-pointer hover:bg-primary hover:text-neutral rounded-sm py-2 px-5">
                  <FontAwesomeIcon icon={faRightToBracket} className='mr-3 text-2xl' />
                  <div className='text-neutral flex items-center justify-center text-md w-full h-full duration-300'>Log In</div>
                </Link>
              </div>

              <Link to={'/SignUp'} className="text-lg text-neutral flex items-center justify-center text-center bg-primary outline outline-2  outline-primary shadow-primary shadow-sm font-Lato hover:shadow-even-lg hover:shadow-primary duration-300 cursor-pointer hover:bg-transparent hover:text-neutral rounded-sm py-2 px-4">
                <FontAwesomeIcon icon={faUserPlus} className='mr-2 text-2xl' />

                <div className="text-neutral flex items-center justify-center text-md w-full h-full hover:shadow-lg duration-300">
                  <div>Sign Up</div>
                </div>
              </Link>

            </>
          )}
        </div>
      </div>


    </nav>

  );
}

export default Navbar;
