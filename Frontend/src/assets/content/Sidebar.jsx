import axios from 'axios'
import React, { useEffect, useState } from 'react'
import backendAPI from '../API/backendAPI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCaretDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [data, setData] = useState(null);
  const [showBlogs, setShowBlogs] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${backendAPI}/GetUserData`, {}, {
          withCredentials: true,
          timeout: 30000
        }).then((res) => {
          setData(res.data.data);
        })
      } catch (error) {
        if (error.response?.status === 404) {
          setData(false);
        } else {
          setData(null);
        }
        console.error('Error fetching data:', error);
      }

    };

    fetchData();
  }, []);

  const handleDraftClick = (index) => {
    Navigate(`/CreateBlog/draft/${index}`)
  };

  const handleBlogClick = (index) => {
    Navigate(`/Blog/${index}`)
  }


  return (
    <div className='w-full h-full flex items-center justify-between border-r border-r-[#45475A]'>
      <div className="w-full h-full">
        {data === null ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader"></div>
          </div>
        ) : data == false ? (
          <div className="w-full h-full px-5 py-6 flex justify-center">
            <div className="bg-[#313244] w-full h-fit p-4 rounded text-center text-white shadow-md space-y-3">
              <div className="text-4xl flex justify-center items-center gap-4 text-red-400">
                <FontAwesomeIcon icon={faUser} />
                <FontAwesomeIcon icon={faBan} />
              </div>
              <p className="text-lg font-semibold tracking-wide text-gray-300">
                You are <span className="text-red-400">not</span> logged in
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full h-full">

              <div className="w-full bg-[#313244] text-white py-5">
                <h1 className="text-4xl font-bold text-center">{data.profile.Username}</h1>
                <p className="text-center text-sm text-gray-300">{data.profile.Email}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-300 pt-2">
                  <span>
                    Blogs: <span className="font-semibold text-white">{data.Blogs?.length || 0}</span>
                  </span>
                  <span>
                    Drafts:{" "}
                    <span className="font-semibold text-white">
                      {data.drafts ? data.drafts.length : 0}
                    </span>
                  </span>
                </div>
              </div>

              <hr className="border-t border-gray-600" />

              {data.Blogs && (
                <div className='mt-2'>
                  <div
                    className="flex justify-start items-center cursor-pointer text-white mb-2"
                    onClick={() => setShowBlogs(!showBlogs)}
                  >
                    <FontAwesomeIcon icon={faCaretDown} className={`${showBlogs ? '' : '-rotate-[90deg]'} ml-2 duration-100 ease-in-out`} />
                    <h2 className="text-xl font-semibold tracking-wide uppercase ml-2">Blogs</h2>
                  </div>
                  {showBlogs && (
                    <ul className="space-y-1 list-disc list-inside ml-6">
                      {Object.keys(data.Blogs).map((blog, idx) => {
                        let BLOG = data.Blogs[blog];

                        return (
                          <li
                            key={idx}
                            className="cursor-pointer hover:bg-[#2A2A3C] text-white px-3 py-1 rounded transition-all overflow-hidden whitespace-nowrap text-ellipsis"
                            onClick={() => handleBlogClick(idx)}
                            title={BLOG.title}
                          >
                            {BLOG.title}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                </div>
              )}

              {data.drafts && (
                <div>
                  <div
                    className="flex justify-start items-center cursor-pointer text-white mb-2"
                    onClick={() => setShowDrafts(!showDrafts)}
                  >
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`${showDrafts ? '' : '-rotate-[90deg]'} ml-2 duration-100 ease-in-out`}
                    />
                    <h2 className="text-xl font-semibold tracking-wide uppercase ml-2">Drafts</h2>
                  </div>

                  {showDrafts && (
                    <ul className="space-y-1 list-disc list-inside ml-6">
                      {Object.keys(data.drafts).map((key, idx) => {
                        const draft = data.drafts[key];

                        return (
                          <li
                            key={key}
                            className="cursor-pointer hover:bg-[#2A2A3C] text-white px-3 py-1 rounded transition-all overflow-hidden whitespace-nowrap text-ellipsis"
                            onClick={() => handleDraftClick(idx)}
                            title={draft.title}
                          >
                            {draft.title}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

            </div>

          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
