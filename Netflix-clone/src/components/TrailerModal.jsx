import React from 'react'
import YouTube from 'react-youtube'
import './TrailerModal.css'

const TrailerModal = ({ trailerUrl, onClose }) => {
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="trailer-modal" onClick={handleClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="trailer-modal-close" onClick={handleClose}>
          ×
        </button>
        <YouTube videoId={trailerUrl} opts={opts} />
      </div>
    </div>
  )
}

export default TrailerModal
