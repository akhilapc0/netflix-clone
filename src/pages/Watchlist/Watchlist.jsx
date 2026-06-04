import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, getWatchlist, removeFromWatchlist } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import './Watchlist.css'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (auth.currentUser) {
        const data = await getWatchlist(auth.currentUser.uid)
        setWatchlist(data)
      }
      setLoading(false)
    }
    fetchWatchlist()
  }, [])

  const handleRemove = async (docId) => {
    await removeFromWatchlist(docId)
    setWatchlist(prev => prev.filter(item => item.docId !== docId))
  }

  return (
    <div className='watchlist-page'>
      <Navbar />
      <div className='watchlist-content'>
        <h1>My Watchlist</h1>
        {loading ? (
          <p className='watchlist-empty'>Loading...</p>
        ) : watchlist.length === 0 ? (
          <div className='watchlist-empty-state'>
            <p>Your watchlist is empty</p>
            <button onClick={() => navigate('/')}>Browse Movies</button>
          </div>
        ) : (
          <div className='watchlist-grid'>
            {watchlist.map((item) => (
              <div key={item.docId} className='watchlist-card'>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt={item.title}
                  onClick={() => navigate(`/player/${item.movieId}`)}
                />
                <div className='watchlist-card-info'>
                  <p className='watchlist-title'>{item.title}</p>
                  <button
                    className='remove-btn'
                    onClick={() => handleRemove(item.docId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist