import axios from 'axios'
import { API_KEY, BASE_URL } from '../config'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  params: {
    api_key: API_KEY,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API response received: ${response.status}`)
    return response
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url
    })
    
    // Handle specific error types
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check internet connection and API availability')
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - API took too long to respond')
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - check your API key')
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded - too many requests')
    }
    
    return Promise.reject(error)
  }
)

// Retry function for failed requests
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      console.log(`Retry attempt ${i + 1} after ${delay}ms delay`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
}

// Movies API service
export const moviesAPI = {
  // Get trending movies/TV shows
  getTrending: (timeWindow = 'week', mediaType = 'all') => {
    return retryRequest(() => api.get(`/trending/${mediaType}/${timeWindow}`))
  },

  // Get popular movies
  getPopular: () => {
    return retryRequest(() => api.get('/movie/popular'))
  },

  // Get top rated movies
  getTopRated: () => {
    return retryRequest(() => api.get('/movie/top_rated'))
  },

  // Get now playing movies
  getNowPlaying: () => {
    return retryRequest(() => api.get('/movie/now_playing'))
  },

  // Get upcoming movies
  getUpcoming: () => {
    return retryRequest(() => api.get('/movie/upcoming'))
  },

  // Get popular TV shows
  getPopularTV: () => {
    return retryRequest(() => api.get('/tv/popular'))
  },

  // Get top rated TV shows
  getTopRatedTV: () => {
    return retryRequest(() => api.get('/tv/top_rated'))
  },

  // Get movie details
  getMovieDetails: (movieId) => {
    return api.get(`/movie/${movieId}`)
  },

  // Get TV show details
  getTVDetails: (tvId) => {
    return api.get(`/tv/${tvId}`)
  },

  // Get movie videos/trailers
  getMovieVideos: (movieId) => {
    return api.get(`/movie/${movieId}/videos`)
  },

  // Get TV show videos/trailers
  getTVVideos: (tvId) => {
    return api.get(`/tv/${tvId}/videos`)
  },

  // Search movies
  searchMovies: (query, page = 1) => {
    return api.get('/search/movie', {
      params: {
        query,
        page,
      },
    })
  },

  // Search TV shows
  searchTV: (query, page = 1) => {
    return api.get('/search/tv', {
      params: {
        query,
        page,
      },
    })
  },

  // Get movie genres
  getMovieGenres: () => {
    return api.get('/genre/movie/list')
  },

  // Get TV genres
  getTVGenres: () => {
    return api.get('/genre/tv/list')
  },

  // Get movies by genre
  getMoviesByGenre: (genreId, page = 1) => {
    return api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
      },
    })
  },

  // Get TV shows by genre
  getTVByGenre: (genreId, page = 1) => {
    return api.get('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
      },
    })
  },
}

// Test API connectivity
export const testAPIConnectivity = async () => {
  try {
    console.log('Testing API connectivity...')
    const response = await api.get('/movie/popular')
    console.log('API test successful:', response.status)
    return { success: true, status: response.status }
  } catch (error) {
    console.error('API test failed:', error)
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      status: error.response?.status
    }
  }
}

export default api
