import { useEffect, useState } from 'react'
import axios from 'axios'
import backendAPI from './assets/API/backendAPI';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './assets/Navbar/Navbar';


function App() {

  return (
    <div className="bg-base text-neutral h-screen">
      <Router>
        <Routes>
          <Route path='/' element={(

            <Navbar />

          )} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
