import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import backendAPI from '../assets/API/backendAPI';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faComment, faExclamationTriangle, faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';

function ShowMainBar() {
  const [Loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(true);
  const [blogContent, setBlogContent] = useState();
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const { key } = useParams();
  const [newComment, setNewComment] = useState('');

  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    axios.post(`${backendAPI}/GetBlog`, { key }, {
      withCredentials: true,
      timeout: 50000,
    })
      .then((res) => {
        const data = Object.values(res.data.data)[0];
        setBlogContent(data);
        setLikesCount(data.usersLiked.length || 0);
        setDislikesCount(data.usersDisliked.length || 0);

        if (data.youLiked) setUserLiked(true);
        if (data.youDisliked) setUserDisliked(true);

        setNotFound(false);
        setLoading(false);
      })
      .catch((err) => {
        setNotFound(true);
        setLoading(false);
      });
  }, [key]);


  const handleLike = async () => {
    const loggedIn = Cookies.get('loggedIn');
    if (!loggedIn) return alert('To like the blog, you have to log in first');

    if (userDisliked) {
      setDislikesCount((prev) => prev - 1);
      setUserDisliked(false);
      await axios.post(`${backendAPI}/blogRemoveDislike`, { key: key }, { withCredentials: true });
    }

    if (!userLiked) {
      setLikesCount((prev) => prev + 1);
      setUserLiked(true);
      await axios.post(`${backendAPI}/BlogLike`, { key: key }, { withCredentials: true });
    } else {
      setLikesCount((prev) => prev - 1);
      setUserLiked(false);
      await axios.post(`${backendAPI}/blogRemoveLike`, { key: key }, { withCredentials: true });
    }
  };

  const handleDislike = async () => {
    const loggedIn = Cookies.get('loggedIn');
    if (!loggedIn) return alert('To dislike the blog, you have to log in first');

    if (userLiked) {
      setLikesCount((prev) => prev - 1);
      setUserLiked(false);
      await axios.post(`${backendAPI}/blogRemoveLike`, { key }, { withCredentials: true });
    }

    if (!userDisliked) {
      setDislikesCount((prev) => prev + 1);
      setUserDisliked(true);
      await axios.post(`${backendAPI}/BlogDislike`, { key }, { withCredentials: true });
    } else {
      setDislikesCount((prev) => prev - 1);
      setUserDisliked(false);
      await axios.post(`${backendAPI}/blogRemoveDislike`, { key }, { withCredentials: true });
    }
  };

  const handleCommentPost = async () => {
    let loggedIn = Cookies.get('loggedIn');
    if (!loggedIn) return alert('Log in to post a comment.')
    if (!newComment.trim()) return alert('Cant post an empty comment');

    setPostingComment(true);
    let response = await axios.post(`${backendAPI}/addComment`,
      { key: key, comment: newComment },
      { withCredentials: true }).then((res) => {
        window.location.reload();
      }).catch((err) => {
        alert('There was an error while posting the comment.')
        setPostingComment(false);
      })
  }

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-white px-[5%] py-10">
      {Loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : notFound == true ? (
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
                <span className='text-2xl'>{likesCount}</span>
              </button>
              <button
                className={`text-lg flex items-center gap-2 transition-transform duration-200 hover:scale-110 hover:text-red-400 active:scale-95 ${userDisliked ? 'text-red-400' : ''}`}
                onClick={handleDislike}

              >
                <FontAwesomeIcon icon={faThumbsDown} size="xl" />
                <span className='text-2xl'>{dislikesCount}</span>
              </button>
            </div>

            <div className="text-sm text-gray-500 italic">by {blogContent.Author} • {blogContent.date}</div>
          </div>

          <hr className="border-gray-600 my-12" />

          <div className="mt-10">
            <div className="flex items-center gap-3 text-xl font-semibold text-gray-200 mb-4">
              <FontAwesomeIcon icon={faComment} size="lg" />
              <span>Comments ({blogContent.comments !== false ? Object.keys(blogContent.comments).length : 0})</span>
            </div>

            <div className="relative mt-6">
              {/* This gets blurred while posting */}
              <div className={`${postingComment ? 'blur-sm opacity-50 pointer-events-none' : ''} transition-all duration-200`}>
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Leave a comment</h2>

                <form className="flex flex-col gap-4" onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentPost();
                }}>
                  <textarea
                    className="w-full bg-[#1E1E2E] text-white p-4 rounded-xl ring-2 border border-gray-600 ring-purple-500 focus:outline-none focus:shadow-even-lg focus:shadow-purple-500 resize-none duration-300"
                    rows="4"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={postingComment}
                  ></textarea>

                  <button
                    type="submit"
                    className="self-end bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200 active:scale-95"
                    disabled={postingComment}
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Loader overlay */}
              {postingComment && (
                <div className="absolute inset-0 flex justify-center items-center bg-[#1E1E2E]/80 rounded-2xl">
                  <div className="loader"></div>
                </div>
              )}

            </div>

                <div className="mt-10">
                  {blogContent.comments == false ? (
                    <div className="text-gray-400 italic">No comments yet. Be the first to say something!</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {blogContent.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="bg-[#2A2A3B] rounded-lg p-4 border border-[#3A3A4D]"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-semibold">{comment.Author}</span>
                            <span className="text-sm text-gray-500 italic">{comment.uploadedDate}</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{comment.commentContent}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>



          </div>
        </div>
      )}
    </div>
  );
}

export default ShowMainBar