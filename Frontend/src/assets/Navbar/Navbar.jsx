import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faArrowRightFromBracket, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Vercity from '../images/Vercity-logo.png'
import { Link } from 'react-router-dom';

function Navbar({ navRef, loggedIn }) {
  const [isFocus, setisFocus] = useState(false);
  const [shadowState, setShadowState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const statePair = {
      5: 'sm',
      10: 'md',
      15: 'lg',
      20: 'xl',
      25: '2xl',
      30: '3xl',
      35: '4xl',
      40: '5xl'
    };

    Object.keys(statePair).forEach((key) => {
      // Convert the key to a number for comparison
      const numericKey = Number(key);

      // Check if the length of searchQuery is greater than or equal to the key
      if (searchQuery.length + 2 >= numericKey) {
        // Setting Custom concern of shadow according to the input length
        setShadowState(`shadow-even-${statePair[key]}`);
      }

      if (searchQuery.length == 0) {
        setShadowState('');
      }
    });
  }, [searchQuery]);

  return (
    <nav ref={navRef} className='bg-base backdrop-blur-md bg-opacity-80 w-screen py-2 flex items-center justify-between fixed shadow-even-md shadow-black'>
      <div className="flex-none w-1/4 flex item-center justify-center"> {/* 25% for logo */}
        <img
          src={Vercity}
          alt=""
          className='filter brightness-125 contrast-100 hover:grayscale-0 transition duration-300 h-14'
        />
      </div>

      <div className="flex-grow w-2/4 py-2"> {/* 50% for search bar */}
        <form action="" className='flex items-center justify-center w-full'>
          <div className={`relative flex items-center justify-center py-2 px-2 w-full rounded-md ${!isFocus ? 'shadow-even-md duration-0' : ''}
            ${isFocus ? `outline-primary outline-2 shadow-primary outline transition-shadow shadow duration-300 ${shadowState}` : ''}`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='mx-1' />
            <input
              type="text"
              placeholder='Search...'
              className='w-full border-0 py-1 px-2 bg-transparent rounded-none focus:outline-0'
              onFocus={() => setisFocus(true)}
              onBlur={() => setisFocus(false)}
              value={searchQuery}
              onChange={async (e) => {
                setSearchQuery(e.target.value)
              }}
            />
          </div>
        </form>
      </div>

      <div className="flex-none w-1/4 mx-8 px-2"> {/* 25% for links */}
        <div className="flex items-center justify-around space-x-4">

          {loggedIn ? (

            <>
              <Link to={'/'} className={`text-lg text-neutral flex items-center justify-center text-center rounded-md font-Lato ${loggedIn ? 'outline outline-2 outline-primary shadow-primary hover:shadow-even-lg hover:shadow-primary transition-colors duration-300 cursor-pointer hover:bg-primary hover:text-neutral rounded-sm py-2 px-3 box-border outline-offset-0' : 'cursor-not-allowed text-gray-400 pointer-events-none select-none opacity-50'}`}>
                <FontAwesomeIcon icon={faPlus} className='mr-2 text-2xl' />
                <div>Create Blog</div>
              </Link>

              <div className="text-lg text-neutral flex items-center justify-center text-center bg-red-500 outline outline-2 rounded-sm outline-red-500 shadow-red-500 shadow-even-sm font-Lato hover:shadow-even-lg hover:shadow-red-500 duration-300 cursor-pointer hover:bg-transparent hover:text-neutral py-2 px-3">
                <FontAwesomeIcon icon={faArrowRightFromBracket} className='mr-2 text-2xl' />
                <Link to={'/'} className='text-neutral flex items-center justify-center text-md w-full h-full hover:shadow-lg duration-300'>
                  Sign Out
                </Link>
                {/* When the user is logged in only the Sign out button along with Create Blog button is visible */}
              </div>

            </>

          ) : (
            <>
              {/* When the user is not Logged in Log in and Sign in button visible along with Create blog but is disabled ofc */}

              <div className="shadow-mg">
                <Link to={'/LogIn'} className="text-lg text-neutral flex items-center justify-center text-center outline outline-2  outline-primary shadow-primary shadow-sm font-Lato hover:shadow-even-lg hover:shadow-primary duration-300 cursor-pointer hover:bg-primary hover:text-neutral rounded-sm py-2 px-5">
                  <FontAwesomeIcon icon={faRightToBracket} className='mr-3 text-2xl' />
                  <div className='text-neutral flex items-center justify-center text-md w-full h-full hover:shadow-lg duration-300'>Log In</div>
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
