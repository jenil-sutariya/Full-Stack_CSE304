import React, { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Row from './components/Row'
import TrailerModal from './components/TrailerModal'
import { moviesAPI, testAPIConnectivity } from './services/apiService'

function App() {
  const [movies, setMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [trailerUrl, setTrailerUrl] = useState('')
  const [showTrailer, setShowTrailer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting to fetch movies...')
      
      const requests = [
        moviesAPI.getTrending('week', 'all'),
        moviesAPI.getTopRated(),
        moviesAPI.getPopular(),
        moviesAPI.getPopularTV(),
        moviesAPI.getNowPlaying(),
        moviesAPI.getTopRatedTV()
      ]

      const responses = await Promise.all(requests)
      
      console.log('All API requests completed successfully')
      
      setMovies([
        { title: 'Trending Now', movies: responses[0].data.results },
        { title: 'Top Rated Movies', movies: responses[1].data.results },
        { title: 'Popular Movies', movies: responses[2].data.results },
        { title: 'Popular TV Shows', movies: responses[3].data.results },
        { title: 'Now Playing', movies: responses[4].data.results },
        { title: 'Top Rated TV Shows', movies: responses[5].data.results }
      ])

      if (responses[0].data.results.length > 0) {
        setFeaturedMovie(responses[0].data.results[0])
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      
      // Set user-friendly error message
      let errorMessage = 'Failed to load movies. '
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Please check your internet connection and try again.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please try again.'
      } else if (error.response?.status === 401) {
        errorMessage += 'API key is invalid. Please check your configuration.'
      } else if (error.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.'
      } else {
        errorMessage += 'An unexpected error occurred. Please try again later.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('')
    } else {
      // For demo purposes, using a sample trailer
      setTrailerUrl('dQw4w9WgXcQ') 
      setShowTrailer(true)
    }
  }

  const closeTrailer = () => {
    setShowTrailer(false)
    setTrailerUrl('')
  }

  const testConnection = async () => {
    console.log('Testing API connection...')
    const result = await testAPIConnectivity()
    if (result.success) {
      alert('API connection successful!')
    } else {
      alert(`API connection failed: ${result.error}`)
    }
  }



  return (
    <div className="app">
      <Navbar />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div className="button-group">
              <button 
                className="retry-button" 
                onClick={fetchMovies}
              >
                Try Again
              </button>
              <button 
                className="test-button" 
                onClick={testConnection}
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Banner movie={featuredMovie} onPlayClick={handleMovieClick} />
          
          <div className="movie-rows">
            {movies.map((category, index) => (
              <Row
                key={index}
                title={category.title}
                movies={category.movies}
                onMovieClick={handleMovieClick}
              />
            ))}
          </div>
        </>
      )}

      {showTrailer && (
        <TrailerModal
          trailerUrl={trailerUrl}
          onClose={closeTrailer}
        />
      )}
    </div>
  )
}

export default App
