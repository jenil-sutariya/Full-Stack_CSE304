# Netflix Clone Setup Instructions

## Getting Started

This Netflix clone fetches data from The Movie Database (TMDB) API without requiring user authentication.

## Setup Steps

### 1. Get TMDB API Key

1. Go to [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Create an account if you don't have one
3. Request an API key (it's free)
4. Copy your API key

### 2. Configure API Key

1. Open `src/config.js`
2. Replace `'your_tmdb_api_key_here'` with your actual TMDB API key:

```javascript
export const API_KEY = 'your_actual_api_key_here'
```

### 3. Run the Application

```bash
npm install
npm run dev
```

The application will start on `http://localhost:5173`

## Features

- Browse trending movies and TV shows
- View movie details and trailers
- Responsive design
- No authentication required
- Real-time data from TMDB

## API Endpoints Used

- Trending movies/TV shows
- Popular movies and TV shows
- Top rated content
- Now playing movies
- Movie/TV show details and videos

## Note

Make sure to keep your API key secure and never commit it to version control.

