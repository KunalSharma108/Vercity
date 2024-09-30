import { useEffect, useState } from 'react'
import axios from 'axios'
import backendAPI from './assets/API/backendAPI';
import {Link, BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './index.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={(
          <h2 className='text-center text-blue-900'> yo </h2>
        )} />

      </Routes>
    </Router>
  )
}

export default App
