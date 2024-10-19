import React from 'react';

function Loading(props) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center text-xl font-bold">
        <p className="text-4xl my-4">Loading...</p>
        <div className="parent-load">
          <div className={`bg-primary bg-warning-loading ${props.class} rounded`}></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
