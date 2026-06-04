import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
import { auth, addToWatchlist, isInWatchlist, removeFromWatchlist } from '../../firebase'

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([])
  const [watchlistStatus, setWatchlistStatus] = useState({})
  const cardsRef = useRef()

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTQxYmNkYTAyNmQxMGI2Zjk3MmYzOTg5MjQ2N2I2MyIsIm5iZiI6MTc4MDI4ODc2Mi44ODk5OTk5LCJzdWIiOiI2YTFkMGNmYWQ3Y2I1MjNlNDA4MmEzYmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aAVV6bQRAi1sMIjjDzpwPpMcpVmhFIM3lAOH1d0sWOg'
    }
  }

  const handleWheel = (event) => {
    event.preventDefault()
    cardsRef.current.scrollLeft += event.deltaY
  }

  // Check watchlist status for all movies
  const checkWatchlistStatus = async (movies) => {
    if (!auth.currentUser) return
    const status = {}
    await Promise.all(
      movies.map(async (movie) => {
        const docId = await isInWatchlist(auth.currentUser.uid, movie.id)
        if (docId) status[movie.id] = docId
      })
    )
    setWatchlistStatus(status)
  }

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => {
        setApiData(res.results)
        checkWatchlistStatus(res.results)
      })
      .catch(err => console.error(err))

    cardsRef.current.addEventListener('wheel', handleWheel)
    return () => {
      if (cardsRef.current) {
        cardsRef.current.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  const handleWatchlist = async (e, movie) => {
    e.preventDefault() // prevent navigating to player
    e.stopPropagation()

    if (!auth.currentUser) {
      alert("Please login first!")
      return
    }

    const docId = watchlistStatus[movie.id]

    if (docId) {
      // Already in watchlist → remove
      await removeFromWatchlist(docId)
      setWatchlistStatus(prev => {
        const updated = { ...prev }
        delete updated[movie.id]
        return updated
      })
    } else {
      // Not in watchlist → add
      await addToWatchlist(auth.currentUser.uid, movie)
      const newDocId = await isInWatchlist(auth.currentUser.uid, movie.id)
      setWatchlistStatus(prev => ({ ...prev, [movie.id]: newDocId }))
    }
  }

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className='card-list' ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link to={`/player/${card.id}`} className='card' key={index}>
            <img
              src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path}
              alt=""
            />
            <p>{card.original_title}</p>

            {/* Watchlist Button */}
            <button
              className={`watchlist-btn ${watchlistStatus[card.id] ? 'watchlisted' : ''}`}
              onClick={(e) => handleWatchlist(e, card)}
            >
              {watchlistStatus[card.id] ? '✓ Watchlisted' : '+ Watchlist'}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TitleCards