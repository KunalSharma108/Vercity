import React, { lazy, Suspense, useEffect } from 'react'
const SignUpContent = lazy(() => import('./SignUpContent'));

function SignUp() {
  return (
    <div className="w-screen h-screen landscape-bg transition-colors duration-200 flex items-center justify-center">
      <Suspense fallback=''>
        <SignUpContent />
      </Suspense>
    </div>

  )
}

export default SignUp