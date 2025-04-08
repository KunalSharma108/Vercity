import axios from "axios";
import React, { useState, useEffect } from "react";
import backendAPI from "../API/backendAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from "react-router-dom";
import { faFileAlt, faTrash } from "@fortawesome/free-solid-svg-icons";


function Sidebar({ navHeight, screenHeight, Index, render, triggerLoading, DialogType }) {
  const navigate = useNavigate();
  const sidebarHeight = screenHeight - navHeight;
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlogs, setShowBlogs] = useState(false);
  const [noDrafts, setNoDrafts] = useState(false);

  useEffect(() => {
    const fetchDrafts = () => {
      try {
        let response = axios.post(`${backendAPI}/getDrafts`, {}, { withCredentials: true, timeout: 10000 }).then((res) => {
          setBlogs(res.data.drafts)
          setTimeout(() => {
            setLoading(false);
            setShowBlogs(true);
          }, 500);
        }).catch((err) => {
          if (err.status == 404) {
            setNoDrafts(true);
            setLoading(false)
          } else {
          }
        })
      } catch (error) {
      }
    }
    fetchDrafts();
  }, []);

  const handleDraftClick = (index) => {
    navigate(`/CreateBlog/draft/${index}`);
    triggerLoading();
  }

  const handleDraftDelete = (index) => {
    const deleteDraft = () => {
      try {
        setLoading(true);
        let response = axios.post(`${backendAPI}/DeleteDraft`, { Index: index },
          {
            withCredentials: true,
            timeout: 10000
          }).then((res) => {
            navigate('/CreateBlog');
            window.location.reload();
          })
      } catch (error) {
        console.log('There was an error :', error);
        alert('We are unable to delete the draft due to an nexpected error, pls try again later');
        window.location.reload();
      }
    }

    DialogType({
      heading: 'Confirm Deletion!',
      text: 'Are you sure you want to delete this draft?',
      clickAction: 'Yes I do',
      handleClick: deleteDraft,
    })

  }

  return (
    <div className={`w-full bg-darkerBase text-white p-4 border-r border-gray-700 shadow-even-lg overflow-y-auto custom-scrollbar`}
      style={{ height: sidebarHeight }}
    >
      <h2 className="text-lg font-semibold mt-1 mb-4">Saved Blogs</h2>

      {render === false ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : noDrafts == true ? (
        <div className="flex flex-col justify-center items-center h-32 bg-gray-900 text-gray-400 rounded-md p-4 shadow-md hover:animate-Shake-slow">
          <FontAwesomeIcon
            icon={faFileAlt}
            className="text-5xl mb-2 opacity-50 animate-[wiggle_1s_ease-in-out_5.8]"
          />


          <span className="text-lg font-semibold">No Drafts Found</span>
        </div>
      ) : showBlogs && render ? (
        <ul className="space-y-2">
          {blogs.map((blog, index) => (
            <li
              key={index}
              className={`flex items-center font-semibold tracking-wide capitalize p-3 bg-gray-800 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-700 hover:scale-105 ${Index && Index === index ? "bg-secondary hover:bg-secondary" : ""
                }`}

            >
              <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis" onClick={() => handleDraftClick(index)}>
                {blog.title}
              </div>
              <div
                className="flex justify-end w-[10%]"
                onClick={() => handleDraftDelete(index)}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="hover:text-red-600 duration-200 scale-125"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

    </div>
  );
}

export default Sidebar;
