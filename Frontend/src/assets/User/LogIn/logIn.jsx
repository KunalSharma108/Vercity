import React, { lazy, Suspense } from 'react'
const LogInContent = lazy(() => import('./LogInContent'));

function LogIn() {
  return (
    <div className="w-screen h-screen landscape-bg transition-colors duration-200 flex items-center justify-center">
      <Suspense fallback=''>
        <LogInContent />
      </Suspense>
    </div>
  )
}

export default LogIn
