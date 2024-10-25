import { faEnvelope, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import backendAPI from '../../API/backendAPI';
import UserSuccessDialog from '../UserSuccessDialog';

function SignUpContent() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [err, setErr] = useState({
    userErr: false,
    emailErr: false,
    passErr: false,
    robotErr: false,
    emailAlreadyInUse: false
  });
  const [isVisible, setIsVisible] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [canSignUp, setCanSignUp] = useState(true);


  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    navigate('/');
    window.location.reload();
  };

  const togglePassEye = () => {
    if (passVisible == false) {
      setPassVisible(true)
    } else if (passVisible == true) {
      setPassVisible(false)
    }
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCanSignUp(false)

    if (username.trim() == '') {
      setErr({
        userErr: true,
        emailErr: false,
        passErr: false,
        robotErr: false,
        emailAlreadyInUse: err.emailAlreadyInUse
      })
      setCanSignUp(true)
    } else if (email.trim() == '') {
      setErr({
        userErr: false,
        emailErr: true,
        passErr: false,
        robotErr: false,
        emailAlreadyInUse: false
      })
      setCanSignUp(true)
    } else if (password.trim() == '' || password.length <= 6) {
      setErr({
        userErr: false,
        emailErr: false,
        passErr: true,
        robotErr: false,
        emailAlreadyInUse: false
      })
      setCanSignUp(true)
    } else if (!isChecked) {
      setErr({
        userErr: false,
        emailErr: false,
        passErr: false,
        robotErr: true,
        emailAlreadyInUse: false
      })
      setCanSignUp(true)
    } else {
      setErr({
        userErr: false,
        emailErr: false,
        passErr: false,
        robotErr: false,
        emailAlreadyInUse: false
      })

      try {
        let result = await axios.post(`${backendAPI}/SignUp`, {
          username,
          email,
          password
        }, { withCredentials: true });

        // If no error
        setErr({
          userErr: false,
          emailErr: false,
          passErr: false,
          robotErr: false,
          emailAlreadyInUse: false
        })

        handleOpen();
        setCanSignUp(true)

      } catch (error) {
        if (error.response) {
          // Handle expected errors like 400 or 409 status codes
          const statusCode = error.response.status;
          if (statusCode === 400) {
            window.alert('There was a problem with your input, need to refresh the page.')
            setCanSignUp(true)
            window.location.reload();

          } else if (statusCode === 409) {

            setErr({
              userErr: false,
              emailErr: false,
              passErr: false,
              robotErr: false,
              emailAlreadyInUse: true
            })
            setCanSignUp(true)

          } else {
            window.alert('Something Wrong happened, Need to refresh the page!')
            setCanSignUp(true)
          }
        } else {
          // If the error doesn't have a response (like network issues)
          window.alert('Something Wrong happened, Need to refresh the page!')
          setCanSignUp(true)
          window.location.reload()
        }
      }

    }
  }

  return (
    <>
      <UserSuccessDialog open={DialogOpen} handleClose={handleClose} userState={'Sign Up'} />

      <div className={`w-[28rem] h-fit border-4 border-gradient rounded-md shadow-gradient shadow-even-lg backdrop-blur-md p-8 transition-all duration-500 ${isVisible ? 'show' : ''}`} id='Form'>

        <div className="text-center mb-8">
          <div className="text-white flex items-center justify-center text-5xl font-extrabold tracking-wide font-Ubuntu">
            Sign Up!
          </div>
        </div>

        <div className="sign-form">
          <form action="">
            {err.userErr == true ? (
              <div className="text-red-500 text-sm mb-2">Username is required.</div>
            ) : null}

            <div className="relative flex items-center border-l-2 border-gray-500 rounded-md mb-4 p-2 bg-gray-800 h-14 ">
              <div className="min-w-[20px] text-white flex justify-center">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter Your Username"
                className="w-full h-full p-2 text-lg bg-transparent border-none focus:outline-none font-Roboto text-gray-400 placeholder-gray-400 focus:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {err.emailErr == true ? (
              <div className="text-red-500 text-sm mb-2">Invalid Email.</div>
            ) : err.emailAlreadyInUse == true ? (
              <div className="text-red-500 text-sm mb-2">Email already in use.</div>
            ) : null}

            <div className="relative flex items-center border-l-2 border-gray-500 rounded-md mb-4 p-2 bg-gray-800 h-14 ">
              <div className="min-w-[20px] text-white flex justify-center">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email"
                className="w-full h-full p-2 text-lg bg-transparent border-none focus:outline-none font-Roboto text-gray-400 placeholder-gray-400 focus:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {err.passErr == true ? (
              <div className="text-red-500 text-sm mb-2">Password should be more than 6 characters.</div>
            ) : null}

            <div className="relative flex items-center border-l-2 border-gray-500 rounded-md mb-4 p-2 bg-gray-800 h-14 ">
              <div className="min-w-[20px] text-gray-300 cursor-pointer flex justify-center" onClick={togglePassEye}>
                {passVisible == false ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </div>
              <input
                type={passVisible == false ? "password" : "text"}
                name="password"
                id="password"
                placeholder="Enter Your Password"
                className="w-full h-full p-2 text-lg bg-transparent border-none focus:outline-none font-Roboto text-gray-400 placeholder-gray-400 focus:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-center mb-4">
              <Link className="text-blue-400 hover:underline" to={'/LogIn'}>
                Already have an account?
              </Link>
            </div>

            {err.robotErr == true ? (
              <div className="text-red-500 text-sm mb-2">We want no Robots!</div>
            ) : null}

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                required
              />
              <label className="ml-3 text-lg text-gray-300">I am not a Robot.</label>
            </div>

            <div className="text-sm text-gray-300 mb-4">
              <p>
                Note - Your privacy matters to us. We never share your email with any third-party, including spam companies. Your trust is our priority.
              </p>
            </div>

            <div className="text-center">
              <button
                className={`w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-[#2355a5] transition-colors duration-300 ${canSignUp ? '' : 'disabled:opacity-30 cursor-not-allowed'}`}
                onClick={(e) => handleSubmit(e)}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUpContent
