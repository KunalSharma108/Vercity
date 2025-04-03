import axios from "axios";
import React, { useState, useEffect } from "react";
import backendAPI from "../API/backendAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


function Sidebar({ navHeight, screenHeight, Index, render }) {
  const navigate = useNavigate();
  const sidebarHeight = screenHeight - navHeight;
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlogs, setShowBlogs] = useState(false);

  useEffect(() => {
    const fetchDrafts = () => {
      try {
        let response = axios.post(`${backendAPI}/getDrafts`, {}, { withCredentials: true, timeout: 10000 }).then((res) => {
          setBlogs(res.data.drafts)
          setTimeout(() => {
            setLoading(false);
            setShowBlogs(true);
          }, 500);
        })
      } catch (error) {
        switch (error) {
          case 409:
            console.log('Unable to fetch drafts')
        }
      }
    }
    fetchDrafts();
  }, []);

  const handleDraftClick = (index) => {
    navigate(`/CreateBlog/draft/${index}`);
  }

  const handleDraftDelete = (index) => {
    const agree = confirm('Are you sure you want to delete this draft?');
    if (agree) {
      try {
        setLoading(true);
        let response = axios.post(`${backendAPI}/DeleteDraft`, {Index: index}, {withCredentials: true}).then((res) => {
          Navigate('/CreateBlog')
        })
      } catch (error) {
        console.log('There was an error :', error);
        alert('We are unable to delete the draft due to an nexpected error, pls try again later');
        window.location.reload();
      }
    } 
  }

  return (
    <div className={`w-full bg-darkerBase text-white p-4 border-r border-gray-700 shadow-even-lg overflow-y-auto custom-scrollbar`}
      style={{ height: sidebarHeight }}
    >
      <h2 className="text-lg font-semibold mt-1 mb-4">Saved Blogs</h2>

      {render == false ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : (
        showBlogs && render && (
          <ul className="space-y-2">

            {blogs.map((blog, index) => (
              <li key={index}
                className={`flex items-center font-semibold tracking-wide capitalize p-3 bg-gray-800 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-700 hover:scale-105 ${Index && Index == index ? 'bg-secondary hover:bg-secondary' : ''}`}
                onClick={() => handleDraftClick(index)}>

                <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {blog.title}
                </div>

                <div
                  className="flex justify-end w-[10%]"
                  onClick={() => handleDraftDelete(index)}
                >
                  <FontAwesomeIcon icon={faTrash} className="hover:text-red-600 duration-200 scale-125" />
                </div>
              </li>
            ))}

          </ul>
        )
      )}
    </div>
  );
}

export default Sidebar;
