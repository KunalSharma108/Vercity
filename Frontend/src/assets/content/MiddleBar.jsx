import axios from 'axios';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import backendAPI from '../API/backendAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function MiddleBar() {
  const [blogId, setBlogId] = useState(false);
  const [blogContent, setBlogContent] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [furtherLoading, setFurtherLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchMoreBlogs = async () => {
    const Now = Date.now();
    if (Now - lastFetchTime < 5000) {
      return alert('You are scrolling too fast.')
    } else {
      setLastFetchTime(Now)
      try {
        console.log(blogId)
        const response = await axios.post(`${backendAPI}/GetBlogs`, { ID: blogId }, {
          withCredentials: true,
          timeout: 100000,
        }).then((res) => {
          let lastKey = Math.max(...Object.keys(res.data.data));
          setBlogId(lastKey);
          setBlogContent(blogContent => [...blogContent, ...Object.values(res.data.data)]);
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
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.post(`${backendAPI}/GetBlogs`, { ID: false }, {
          withCredentials: true,
          timeout: 100000,
        }).then((res) => {
          setBlogId(res.data.data[res.data.data.length - 1].Index);
          setBlogContent(res.data.data);
          setLoading(false)
        })
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setRepeat(true);
              console.log('Repeating the old ones.');
              alert(error.response.msg);
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

  return (
    <div className='w-full h-full p-2'>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : blogContent ? (
        <div className="w-full flex flex-col items-center">
          {blogContent.map((blog, idx) => (
            <div
              ref={idx == blogContent.length - 1 ? divRef : null}
              key={idx}
              className="w-11/12 max-w-4xl border-4 border-secondary shadow-secondary shadow-md rounded-2xl py-8 px-6 my-8 hover:shadow-even-2xl hover:shadow-secondary hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            >
              <h2 className="font-serif font-bold text-3xl text-white mb-4">{blog.title}</h2>

              <div
                className="text-white text-base mb-6 line-clamp-3"
                style={{ color: 'white' }}
                dangerouslySetInnerHTML={{ __html: blog.descHTML }}
              ></div>

              <div className="flex items-center justify-between text-xs text-white/80">
                <div className="flex gap-6">
                  <span className='text-lg'><FontAwesomeIcon icon={faThumbsUp} size='lg' /> {blog.likesCount}</span>
                  <span className='text-lg'><FontAwesomeIcon icon={faThumbsDown} size='lg' /> {blog.dislikesCount}</span>
                  <span className='text-lg'><FontAwesomeIcon icon={faComment} size='lg' /> {blog.comments ? 1 : 0}</span>
                </div>
                <div>
                  by {blog.Author} • {blog.uploadedDate}
                </div>
              </div>
            </div>
          ))}
          {
            furtherLoading && (
              <div className="flex justify-center items-center h-32">
                <div className="loader"></div>
              </div>
            )
          }
        </div>

      ) : (
        <></>
      )}
    </div>
  )
}

export default MiddleBar