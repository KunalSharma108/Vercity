import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import backendAPI from '../assets/API/backendAPI';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faComment, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';

function MainBar() {
  const [Loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [blogContent, setBlogContent] = useState();
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [usersLikedCount, setUsersLikedCount] = useState(0);
  const [usersDislikedCount, setUsersDislikedCount] = useState(0);
  const { key } = useParams();

  useEffect(() => {
    const response = axios.post(`${backendAPI}/GetBlog`, { key: key }, {
      withCredentials: true,
      timeout: 50000,
    }).then((res) => {
      setBlogContent(Object.values(res.data.data)[0]);
      setLoading(false);
      setNotFound(false);
    }).catch((err) => {
      setNotFound(true);
      setLoading(false);
    })
  }, [key]);

  const handleLike = async () => {
    let loggedIn = Cookies.get('loggedIn');
    if (loggedIn) {
      setUserLiked(true);
      setUserDisliked(false);
      let response = await axios.post(`${backendAPI}/BlogLike`, { key: key }, { withCredentials: true });
    } else {
      alert('To like the blog, you have to log in first')
    }
  }

  const handleDislike = async () => {
    let loggedIn = Cookies.get('loggedIn');
    if (loggedIn) {
      setUserLiked(false);
      setUserDisliked(true);
      let response = await axios.post(`${backendAPI}/BlogDislike`, { key: key }, { withCredentials: true });
    } else {
      alert('To dislike the blog, you have to log in first')
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-white px-[5%] py-10">
      {Loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-400 py-20">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Blog Not Found</h1>
          <p className="text-md text-gray-500">The blog you're looking for doesn't exist or has been removed.</p>
        </div>
      ) : (
        <div className="max-w-full mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">{blogContent.title}</h1>

          <div
            className="prose prose-invert prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: blogContent.descHTML }}
          />

          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-6 text-gray-300">
              <button
                className={`text-lg flex items-center gap-2 transition-transform duration-200 hover:scale-110 hover:text-green-400 active:scale-95 ${userLiked ? 'text-green-400' : ''}`}
                onClick={handleLike}
              >
                <FontAwesomeIcon icon={faThumbsUp} size="xl" />
                <span className='text-2xl'>{blogContent.likesCount}</span>
              </button>
              <button
                className={`text-lg flex items-center gap-2 transition-transform duration-200 hover:scale-110 hover:text-red-400 active:scale-95 ${userDisliked ? 'text-red-400' : ''}`}
                onClick={handleDislike}

              >
                <FontAwesomeIcon icon={faThumbsDown} size="xl" />
                <span className='text-2xl'>{blogContent.dislikesCount}</span>
              </button>
            </div>

            <div className="text-sm text-gray-500 italic">{blogContent.date}</div>
          </div>

          <hr className="border-gray-600 my-12" />

          <div className="mt-10">
            <div className="flex items-center gap-3 text-xl font-semibold text-gray-200 mb-4">
              <FontAwesomeIcon icon={faComment} size="lg" />
              <span>Comments ({blogContent.comments ? 1 : 0})</span>
            </div>

            <div className="text-gray-400 italic">No comments yet. Be the first to say something!</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainBar

// ADD A COUTNING SYSTEM TO CHANGE THE COUNT WHENEVER USER CLICKS AND TEST THAT REMOVE LIKE AND REMOVE DISLIKE FEATURE TOO, THEN PROCEED WITH ADDING COMMENTS