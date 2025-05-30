import { faBoxArchive, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import backendAPI from '../API/backendAPI';
import { useLocation, useNavigate } from 'react-router-dom';

function BlogContent({ DialogType, content, index, render, triggerLoading }) {
  const location = useLocation();
  const [blogTitle, setBlogTitle] = useState('');
  const [blogTitleLen, setBlogTitleLen] = useState(0);
  const [isAnimation, setIsAnimation] = useState(false);
  const [blogDesc, setBlogDesc] = useState('');
  const [descHTML, setDescHTML] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    const updateDraftContent = () => {
      if (content && index) {
        setBlogTitle(content.title);
        setBlogDesc(content.descHTML);
        setDescHTML(content.descHTML)
      }
    }

    updateDraftContent();
  }, [content, index]);

  useEffect(() => {
    if (blogTitle.trim() != '') {
      document.title = `Vercity - ${blogTitle}`
    } else {
      document.title = 'Vercity'
    }

  }, [blogTitle])

  const handleBlogTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 150) {
      if (isAnimation != true) {
        setIsAnimation(true)
        setTimeout(() => {
          setIsAnimation(false)
        }, 300);
      }
    } else {
      setBlogTitle(value);
      setBlogTitleLen(value.length);
    }
  };

  const handleBlogDescChange = (value, delta, source, editor) => {
    const textContent = editor.getContents();
    setBlogDesc(textContent);
    setDescHTML(value)
  };

  const handleDraftView = (blogIndex) => {
    Navigate(`/CreateBlog/draft/${blogIndex}`);
    window.location.reload();
  }

  const handleGoHome = () => {
    Navigate('/')
  }

  const handleSave = async () => {
    if (blogTitle.trim() == '' || blogDesc.ops[0].insert.trim() == '') {
      alert('Any content of the blog cannot be empty.')
      return
    }

    const draftBlogContent = { title: blogTitle, descHTML: descHTML }

    try {
      let response = await axios.post(`${backendAPI}/blogDraft`, { draftBlogContent }, {
        withCredentials: true,
        timeout: 10000
      }).then((res) => {
        DialogType(
          {
            heading: 'Draft Successful!',
            text: 'Your blog has been successfully saved as a draft!',
            clickAction: 'View Draft',
            handleClick: () => handleDraftView(res.data.index)
          })
      })

    } catch (error) {
      switch (error.status) {
        case 409:
          DialogType(
            {
              heading: 'Draft Already exists!',
              text: 'Your blog is not being saved as draft because a similiar draft already exists.',
              clickAction: 'View Draft',
              handleClick: handleDraftView
            })
          break;
        case 404:
          DialogType(
            {
              heading: 'Unexpected error!',
              text: 'Your blog could not be saved as draft because an error occured, Please try again later.',
              clickAction: 'Home',
              handleClick: handleGoHome
            })
          break;
        default:
          DialogType(
            {
              heading: 'Unexpected error!',
              text: 'Your blog could not be saved as draft because an error occured, Please try again later.',
              clickAction: 'Home',
              handleClick: handleGoHome
            })
          break;
      }
    }

  }

  const handleUpdate = (index) => {
    try {
      const blogData = { title: blogTitle, descHTML: descHTML };
      let response = axios.post(`${backendAPI}/UpdateDraft`, { Index: index, blogData: blogData }, {
        withCredentials: true,
        timeout: 10000
      }).then((res) => {
        DialogType({
          heading: 'Update Successful',
          text: 'Your draft was successfuly updated',
          clickAction: 'Home',
          handleClick: handleGoHome
        })
      })
    } catch (error) {
      DialogType({
        heading: 'Update Failed!',
        text: 'There was an error while Updating your draft.',
        clickAction: 'Home',
        handleClick: handleGoHome
      })
    }
  }

  const handleViewBlog = (index) => {
    Navigate(`/blog/${index}`);
  }

  const handleUpload = () => {
    triggerLoading()
    try {
      const blogData = {
        title: blogTitle,
        descHTML: descHTML,
        likesCount: 0,
        usersLiked: false,
        comments: false,
        dislikesCount: 0,
        usersDisliked: false,
      };

      if (blogData.title.trim() == '' || blogData.descHTML.trim() == '') {
        return alert('Any Content of the blog cannot be empty.')
      }

      let response = axios.post(`${backendAPI}/UploadBlog`, { blogData: blogData }, {
        withCredentials: true,
        timeout: 30000
      }).then((res) => {

        DialogType({
          heading: 'Upload Successful!',
          text: 'Your Blog was successfully uploaded! Everyone can see your blog now.',
          clickAction: 'View Blog',
          handleClick: () => handleViewBlog(res.data.Index)
        })
      })

    } catch (error) {
      DialogType({
        heading: 'Upload Failed!',
        text: 'There was an error while uploading your blog.',
        clickAction: 'Home',
        handleClick: handleGoHome
      })
    }
  }

  return (
    <>
      {render == false ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-full h-fit flex flex-col items-center py-3 overflow-hidden mt-1">
          <div className="font-bold text-[30px] text-neutral font-Ubuntu">Create Blog</div>
          <div className="w-full h-fit py-2 flex justify-center items-center">
            <div
              className={`w-2/3 bg-[#33334d] text-neutral h-[100px] text-lg rounded-md border border-[#a6a6ff] shadow-gray-900 shadow-even-lg focus:outline-none border-x-2 border-y-2 resize-none duration-300 pb-2 ${isAnimation ? 'animate-Shake' : ''}`}
              
            >

              <textarea
                type="text"
                className="w-full h-full font-Lato border-none outline-none focus:outline-none bg-transparent text-top align-text-top pl-4 resize-none px-2 pt-2 tracking-wide box-border overflow-auto"
                placeholder="Title..."
                value={blogTitle}
                onChange={handleBlogTitleChange}
              />

              <p className="text-neutral font-normal font-sans text-xs flex justify-end align-middle mt-2 pr-1">
                {blogTitleLen}/150
              </p>
            </div>
          </div>
          <div className="w-2/3 text-neutral mt-9">
            <ReactQuill
              className="custom-quill"
              value={blogDesc}
              onChange={handleBlogDescChange}
              theme='snow'
              placeholder='Description of your blog...'
            />
          </div>
          <div className="flex justify-start mt-6">

            {
              content && index ? (
                <button className="w-fit h-fit mr-5 bg-white bg-opacity-30 px-5 py-3 mt-3 rounded-md cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#ffffff63] text-neutral font-sans font-semibold tracking-wide text-[18px] focus:outline-none flex justify-center align-middle text-center"
                  onClick={() => handleUpdate(index)}
                >
                  <FontAwesomeIcon icon={faBoxArchive} className='mr-3 text-2xl' />
                  Update Draft
                </button>
              ) : (
                <button className="w-fit h-fit mr-5 bg-white bg-opacity-30 px-5 py-3 mt-3 rounded-md cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#ffffff63] text-neutral font-sans font-semibold tracking-wide text-[18px] focus:outline-none flex justify-center align-middle text-center"
                  onClick={handleSave}
                >
                  <FontAwesomeIcon icon={faBoxArchive} className='mr-3 text-2xl' />
                  Save as draft
                </button>
              )
            }

            <button className="w-fit h-fit px-5 bg-success bg-opacity-90 py-3 mt-3 rounded-md cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-success text-neutral font-sans font-semibold tracking-wide text-[18px] focus:outline-none flex justify-center align-middle text-center"
              onClick={handleUpload}
            >
              Upload Blog
              <FontAwesomeIcon icon={faUpload} className='ml-3 text-2xl' />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogContent;
