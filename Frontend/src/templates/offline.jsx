import React from 'react';

function Offline() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center text-xl font-bold">
        <div className="bg-red-500 text-white p-3 rounded-md">
          <p>Server is Offline, Please try again later :(</p>
        </div>
      </div>
    </div>
  );
}

export default Offline;
