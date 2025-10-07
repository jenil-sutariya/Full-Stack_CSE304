import React, { useState, useRef } from 'react'
import './Row.css'

const Row = ({ title, movies, onMovieClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const rowRef = useRef(null)

  const scroll = (direction) => {
    setIsScrolled(true)
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-posters" ref={rowRef}>
        {movies?.map((movie) => (
          <img
            key={movie.id}
            onClick={() => onMovieClick(movie)}
            className="row-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name}
          />
        ))}
      </div>
      
      <button 
        className={`row-arrow row-arrow-left ${!isScrolled && 'hidden'}`}
        onClick={() => scroll('left')}
      >
        ‹
      </button>
      
      <button 
        className="row-arrow row-arrow-right"
        onClick={() => scroll('right')}
      >
        ›
      </button>
    </div>
  )
}

export default Row
