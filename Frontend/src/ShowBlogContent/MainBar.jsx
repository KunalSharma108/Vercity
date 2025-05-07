import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function MainBar() {
  const { key } = useParams();
  
  useEffect(() => {

  })
  return (
    <div>
      yooooo {key}
    </div>
  )
}

export default MainBar
