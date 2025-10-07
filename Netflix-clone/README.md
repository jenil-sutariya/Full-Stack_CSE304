# Netflix Clone

A complete Netflix clone built with React, featuring TMDB API integration, responsive design, and trailer functionality.

## Features

- 🎬 **TMDB API Integration**: Fetches real movie and TV show data
- 🎨 **Netflix-style UI**: Authentic Netflix design and animations
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎥 **Trailer Popup**: Click any movie to watch its trailer
- 🎯 **Animated Rows**: Smooth scrolling movie rows with hover effects
- 🧭 **Navigation Bar**: Netflix-style navbar with scroll effects
- 🎪 **Banner**: Featured content banner with play functionality

## Setup Instructions

### 1. Get TMDB API Key

1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to [API Settings](https://www.themoviedb.org/settings/api)
4. Request an API key (it's free!)
5. Copy your API key

### 2. Configure API Key

1. Open `src/App.jsx`
2. Replace `YOUR_TMDB_API_KEY` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here'
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar component
│   ├── Navbar.css          # Navbar styles
│   ├── Banner.jsx          # Featured content banner
│   ├── Banner.css          # Banner styles
│   ├── Row.jsx             # Movie row component
│   ├── Row.css             # Row styles
│   ├── TrailerModal.jsx    # Trailer popup modal
│   └── TrailerModal.css    # Modal styles
├── App.jsx                 # Main application component
├── App.css                 # Main application styles
├── index.css               # Global styles
└── main.jsx                # Application entry point
```

## Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **React YouTube** - YouTube video player integration
- **CSS3** - Styling and animations
- **TMDB API** - Movie and TV show data

## API Endpoints Used

- Trending content: `/trending/all/week`
- Top rated movies: `/movie/top_rated`
- Popular movies: `/movie/popular`
- Popular TV shows: `/tv/popular`
- Now playing: `/movie/now_playing`
- Top rated TV shows: `/tv/top_rated`

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

### GitHub Repository

1. Initialize git repository:
   ```bash
   git init
   ```

2. Add all files:
   ```bash
   git add .
   ```

3. Commit:
   ```bash
   git commit -m "Initial commit: Netflix clone"
   ```

4. Add remote repository:
   ```bash
   git remote add origin https://github.com/yourusername/netflix-clone.git
   ```

5. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## Customization

- **Colors**: Modify CSS variables in `App.css` and component CSS files
- **API Requests**: Add more TMDB endpoints in `App.jsx`
- **Components**: Extend existing components or create new ones
- **Styling**: Update CSS files to match your preferred design

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure you've replaced the placeholder with your actual TMDB API key
2. **CORS Issues**: TMDB API supports CORS, but if you encounter issues, check your API key permissions
3. **Build Errors**: Ensure all dependencies are installed with `npm install`

### Performance Tips

- The app uses lazy loading for images
- API requests are optimized with Promise.all for parallel fetching
- CSS animations are hardware-accelerated for smooth performance

## License

This project is for educational purposes only. Netflix is a trademark of Netflix, Inc.

## Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Note**: Remember to keep your API key secure and never commit it to public repositories. Use environment variables in production.