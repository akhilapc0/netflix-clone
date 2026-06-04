import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import Watchlist from './pages/Watchlist/Watchlist'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only redirect to home if currently on login page
        if (window.location.pathname === '/login') {
          navigate('/')
        }
      } else {
        // Only redirect to login if NOT already on login page
        if (window.location.pathname !== '/login') {
          navigate('/login')
        }
      }
      setAuthChecked(true)
    })
    return () => unsubscribe() // cleanup listener
  }, [])

  // Don't render anything until auth state is checked
  if (!authChecked) return null

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
        <Route path='/watchlist' element={<Watchlist />} />
      </Routes>
    </div>
  )
}

export default App