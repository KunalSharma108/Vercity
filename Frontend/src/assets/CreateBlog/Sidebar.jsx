import axios from "axios";
import React, { useState, useEffect } from "react";
import backendAPI from "../API/backendAPI";
import { useNavigate } from "react-router-dom";

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
              <li
                key={index}
                className={`font-semibold tracking-wide capitalize p-3 bg-gray-800 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-700 hover:scale-105 overflow-hidden whitespace-nowrap text-ellipsis ${Index && Index == index ? 'bg-secondary hover:bg-secondary' : ''}`}
                onClick={() => handleDraftClick(index)}
              >
                {blog.title}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default Sidebar;
