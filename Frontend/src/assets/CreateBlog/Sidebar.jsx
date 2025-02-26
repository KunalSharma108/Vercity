import React, { useState, useEffect } from "react";

function Sidebar({ navHeight, screenHeight }) {
  const sidebarHeight = screenHeight - navHeight;
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlogs, setShowBlogs] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBlogs(["Blog 1", "Blog 2", "Blog 3", "Blog 4", "Blog 5", "Blog 6"]); // Replace with API response
      setLoading(false);

      setTimeout(() => {
        setShowBlogs(true);
      }, 500);
    }, 2000);
  }, []);


  return (
    <div className={`w-full bg-darkerBase text-white p-4 border-r border-gray-700 shadow-even-lg overflow-y-auto custom-scrollbar`}
      style={{ height: sidebarHeight }}
    >
      <h2 className="text-lg font-semibold mt-1 mb-4">Saved Blogs</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader"></div>
        </div>
      ) : (
        showBlogs && (
          <ul className="space-y-2">
            {blogs.map((blog, index) => (
              <li
                key={index}
                className="p-3 bg-gray-800 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-700 hover:scale-105"
              >
                {blog}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default Sidebar;
