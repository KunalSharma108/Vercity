import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faMartiniGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import Vercity from '../images/Vercity-logo.png'
import { Link } from 'react-router-dom';

function Navbar() {
  const [isfocus, setIsFocus] = useState(false);
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
    <nav className='bg-base bg-opacity-70 w-screen py-2 border-gray-800 border-b-[1px] flex items-center justify-between fixed'>
      <div className="flex-none w-1/4"> {/* 25% for logo */}
        <img
          src={Vercity}
          alt=""
          className='filter brightness-125 contrast-100 hover:grayscale-0 transition duration-300 h-14 my-1 mx-5'
        />
      </div>

      <div className="flex-grow mx-5"> {/* 50% for search bar */}
        <form action="" className='flex items-center justify-center w-full'>
          <div className={`relative flex items-center justify-center py-2 px-2 w-full rounded-md shadow 
            ${isfocus ? `outline-primary outline-2 shadow-primary outline transition-shadow shadow duration-300 ${shadowState}` : ''}`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className=' ' />
            <input
              type="text"
              placeholder='search...'
              className='w-full border-0 py-1 px-2 bg-transparent rounded-none focus:outline-0'
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              value={searchQuery}
              onChange={async (e) => {
                setSearchQuery(e.target.value)
              }}
            />
          </div>
        </form>
      </div>

      <div className="flex-none w-1/4 mx-8"> {/* 25% for links */}
        <div className="flex items-center justify-between h-full">
          <Link to={'/'} className="text-neutral flex items-center justify-center text-sm">
            <FontAwesomeIcon icon={faPlus} className='mx-2 text-2xl' />
            <div>Create Blog</div>
          </Link>

          <div className="shadow-mg rounded-md">
            <div
              className="text-lg text-neutral flex items-center justify-between text-center outline outline-2 rounded-md outline-primary shadow-primary shadow-sm font-Lato hover:shadow-even-md hover:shadow-primary duration-300 cursor-pointer hover:bg-gray-950"
            >
              <Link to={'/'} className='w-full h-full hover:shadow-lg duration-300 py-1 px-3'>Log In</Link>
            </div>
          </div>

          <Link to={'/'} className="text-neutral flex items-center justify-center text-sm">
            <div>Sign Up</div>
          </Link>
        </div>
      </div>
    </nav>

  );
}

export default Navbar;
