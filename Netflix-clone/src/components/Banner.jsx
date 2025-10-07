import React from 'react'
import './Banner.css'

const Banner = ({ movie, onPlayClick }) => {
  if (!movie) return null

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="banner-contents">
        <h1 className="banner-title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        
        <div className="banner-buttons">
          <button 
            className="banner-button"
            onClick={() => onPlayClick(movie)}
          >
            ▶ Play
          </button>
          <button className="banner-button">
            + My List
          </button>
        </div>
        
        <h1 className="banner-description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      
      <div className="banner-fadeBottom" />
    </header>
  )
}

export default Banner
