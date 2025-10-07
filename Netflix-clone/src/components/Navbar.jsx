import React, { useState, useEffect } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${show && 'navbar-black'}`}>
      <div className="navbar-contents">
        <img
          className="navbar-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
        />
        
        <div className="navbar-menu">
          <a href="#home" className="navbar-link">Home</a>
          <a href="#tv-shows" className="navbar-link">TV Shows</a>
          <a href="#movies" className="navbar-link">Movies</a>
          <a href="#new-popular" className="navbar-link">New & Popular</a>
          <a href="#my-list" className="navbar-link">My List</a>
        </div>

        <div className="navbar-right">
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="Search movies, TV shows..." 
              className="search-input"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
