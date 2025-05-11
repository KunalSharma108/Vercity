import axios from 'axios';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import backendAPI from '../API/backendAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


function MiddleBar() {
  const [blogId, setBlogId] = useState(false);
  const [blogContent, setBlogContent] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [furtherLoading, setFurtherLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const Navigate = useNavigate();

  const fetchMoreBlogs = async () => {
    try {
      const response = await axios.post(`${backendAPI}/GetBlogs`, { ID: blogId }, {
        withCredentials: true,
        timeout: 100000,
      }).then((res) => {
        setBlogId(Object.keys(res.data.data)[Object.keys(res.data.data).length - 1])
        setBlogContent(blogContent => ({ ...blogContent, ...res.data.data }))
        setFurtherLoading(false)
      })
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setRepeat(true);
            break;
          case 409:
            break;
          default:
            break;
        }
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.post(`${backendAPI}/GetBlogs`, { ID: false }, {
          withCredentials: true,
          timeout: 100000,
        }).then((res) => {
          setBlogId(Object.keys(res.data.data)[Object.keys(res.data.data).length - 1])
          setBlogContent(res.data.data);
          setLoading(false)
        })
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setRepeat(true);
              setLoading(false);
              console.log('Repeating the old ones.');
              break;
            case 409:
              console.log('A conflict error happened.');
              break;
            default:
              console.log('An unexpected server error.');
              break;
          }
        } else {
          console.log(error);
        }
      }
    }

    fetchBlogs();

  }, []);
  const observerRef = useRef();

  const divRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (furtherLoading === false) {
          setFurtherLoading(true)
          fetchMoreBlogs();
        }
      }
    }, {
      threshold: 0.1
    });

    if (node) observerRef.current.observe(node);
  }, [blogContent, blogId]);

  const handleBlogClick = (blog) => {
    Navigate(`/blog/${blog}`);
  }

  return (
    <div className='w-full h-full p-2'>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : blogContent ? (
        <div className="w-full flex flex-col items-center">
          {Object.keys(blogContent).map((key, idx) => {
            const blog = blogContent[key];

            return (
              <div
                ref={idx === Object.keys(blogContent).length - 1 ? divRef : null}
                key={key}
                className="w-11/12 max-w-4xl border-4 border-secondary shadow-secondary shadow-md rounded-2xl py-8 px-6 my-8 hover:shadow-even-2xl hover:shadow-secondary hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                onClick={() => handleBlogClick(key)}
              >
                <h2 className="font-serif font-bold text-3xl text-white mb-4">{blog.title}</h2>

                <div
                  className="text-white text-base mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.descHTML }}
                ></div>

                <div className="flex items-center justify-between text-xs text-white/80">
                  <div className="flex gap-6">
                    <span className="text-lg"><FontAwesomeIcon icon={faThumbsUp} size="lg" className='mr-2' />
                      {Object.keys(blog.usersLiked).length}
                    </span>
                    <span className="text-lg"><FontAwesomeIcon icon={faThumbsDown} size="lg" className='mr-2' />
                      {Object.keys(blog.usersDisliked).length}
                    </span>
                    <span className="text-lg"><FontAwesomeIcon icon={faComment} size="lg" className='mr-2' />
                      {blog.comments ? blog.comments.length : 0}
                    </span>
                  </div>
                  <div>
                    by {blog.Author} • {blog.uploadedDate || blog.date}
                  </div>
                </div>
              </div>
            );
          })}

          {
            furtherLoading && (
              <div className="flex justify-center items-center h-32">
                <div className="loader"></div>
              </div>
            )
          }
          {repeat && (
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
              <FontAwesomeIcon icon={faCheckCircle} size='4x' />
              <h2 className="text-xl font-semibold">You’ve reached the end!</h2>
              <p className="text-sm mt-1">
                No more fresh blogs for now. You might see some old ones again.
              </p>
            </div>
          )}
        </div>

      ) : (
        <></>
      )}
    </div>
  )
}

export default MiddleBar