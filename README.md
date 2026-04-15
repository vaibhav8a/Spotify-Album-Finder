# 🎵 Albumix - Modern Music Discovery Platform

A sleek, modern web application for discovering, exploring, and saving your favorite albums. Built with React, Spotify API, and modern web technologies.

![Albumix](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue?logo=tailwindcss)
![Spotify API](https://img.shields.io/badge/Spotify-API-1DB954?logo=spotify)

## 🌟 Features

### Core Features
- 🔍 **Advanced Search** - Search albums, artists, and songs in real-time
- 💿 **Album Details** - View comprehensive information about any album
- 🎵 **Track Previews** - Listen to 30-second previews of songs (when available)
- ❤️ **Save Favorites** - Save your favorite albums locally using LocalStorage
- 🎁 **New Releases** - Discover trending and featured albums
- 📊 **Smart Filtering** - Filter by year, popularity, and more
- 🎚️ **Sorting Options** - Sort by popularity, release date, name, and more

### Advanced Features
- 🌈 **Beautiful UI** - Glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Dark Mode** - Premium dark theme optimized for music discovery
- ✨ **Smooth Animations** - Framer Motion animations throughout
- 🔗 **Spotify Integration** - Open albums directly in Spotify
- 📚 **Recently Viewed** - Track your recently viewed albums
- 🕐 **Recently Searched** - Quick access to recent searches

## 📸 Screenshots

### Home Page
- Large hero section with gradient background
- Search bar with voice search capability
- New releases section
- Browse by mood categories
- Recently searched section

### Search Results
- Responsive grid layout
- Album cards with rich information
- Filter and sort options
- Loading states with skeleton loaders
- No results handling

### Album Details
- Large album cover with hover effects
- Comprehensive album information
- Full track list with preview capabilities
- Related albums from same artist
- Spotify integration button

### Favorites Page
- All saved favorite albums
- Organized grid layout
- Quick access to manage favorites
- Empty state guidance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library

### State Management & Storage
- **Zustand** - Lightweight state management
- **LocalStorage** - Persistent storage for favorites

### API & Data
- **Spotify Web API** - Music data
- **Axios** - HTTP client

### UI Components
- **React Icons** - Icon library
- **Chart.js** - Data visualization (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

### Installation

1. **Clone the repository**
   ```bash
   cd Spotify_albumfinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify API credentials**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Get your Client ID and Client Secret
   - Create a `.env` file in the root directory:
   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📋 Usage

### Searching
1. Enter an album name, artist name, or song title in the search bar
2. Press Enter or click the Search button
3. Browse through the results

### Filtering & Sorting
1. Use the filter bar to narrow results by:
   - **Year** - Filter by release year
   - **Popularity** - Filter by minimum popularity score
   - **Sort** - Sort by popularity, newest, oldest, or alphabetical

### Saving Favorites
1. Click the heart icon on any album card
2. View all favorites in the Favorites page
3. Favorites persist across browser sessions

### Previewing Tracks
1. Open an album details page
2. Click the play button on any track
3. Listen to the 30-second preview

### Opening in Spotify
1. Click the "Open on Spotify" button on album details page
2. Opens the album in Spotify (requires Spotify account)

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── AlbumCard.jsx
│   ├── ArtistCard.jsx
│   ├── FavoriteButton.jsx
│   ├── FilterBar.jsx
│   ├── Footer.jsx
│   ├── Loader.jsx
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── TrackList.jsx
│   └── index.js
├── pages/              # Page components
│   ├── AboutPage.jsx
│   ├── AlbumDetailsPage.jsx
│   ├── FavoritesPage.jsx
│   ├── HomePage.jsx
│   ├── SearchPage.jsx
│   └── index.js
├── services/           # API services
│   └── spotifyApi.js
├── context/            # State management
│   └── store.js
├── hooks/              # Custom hooks
│   └── index.js
├── utils/              # Utility functions
│   └── helpers.js
├── App.jsx
├── index.jsx
└── index.css
```

## 🎨 Design System

### Color Palette
- **Primary** - Spotify Green: `#1DB954`
- **Background** - Dark Black: `#0f172a`
- **Card Background** - Dark Gray: `#1e293b`
- **Accent** - Purple: `#8b5cf6`
- **Text** - White/Light Gray: `#f1f5f9`

### Key Design Elements
- **Glassmorphism** - Semi-transparent glass effect on cards
- **Gradient Backgrounds** - Dynamic gradients
- **Smooth Animations** - Framer Motion for all transitions
- **Premium Typography** - System fonts optimized
- **Responsive Grid** - Auto-adjusting layouts

## 🔑 Key Components

### Navbar
- Logo with hover effects
- Navigation links
- Theme toggle
- Mobile-responsive menu

### SearchBar
- Real-time search input
- Voice search button
- Loading states
- Search suggestions

### AlbumCard
- Album artwork
- Album metadata
- Popularity badge
- Favorite button
- Hover animations

### TrackList
- Track number, name, artist
- Duration display
- Play/pause functionality
- 30-second previews

### FilterBar
- Sort options
- Year filtering
- Popularity filtering
- Clear filters button

## 🌐 API Endpoints Used

- `GET /search` - Search for albums, artists, tracks
- `GET /albums/{id}` - Get album details
- `GET /albums/{id}/tracks` - Get album tracks
- `GET /artists/{id}` - Get artist details
- `GET /artists/{id}/albums` - Get artist's albums
- `GET /browse/new-releases` - Get new releases
- `GET /browse/featured-playlists` - Get featured playlists
- `GET /recommendations` - Get recommendations

## 💾 Local Storage

Albumix uses LocalStorage for:
- **Favorites** (`albumix-favorites`) - Saved album data
- **Recent Searches** (`albumix-recent-searches`) - Search history
- **Recently Viewed** (`albumix-recently-viewed`) - Viewed albums
- **Spotify Token** (`spotifyAccessToken`) - API authentication

## 🔒 Security Notes

- Client credentials flow is used for API authentication
- No user passwords are stored
- Access tokens are cached with expiration
- All external links open in new tabs

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Building for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🎯 Future Improvements

- [ ] User authentication with Spotify OAuth
- [ ] Personalized recommendations
- [ ] Playlist creation
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Voice search integration
- [ ] Offline mode
- [ ] Genre-based browsing
- [ ] User ratings and reviews
- [ ] Music mood playlists

## 🐛 Known Issues

- Some albums may not have preview URLs available
- Spotify API rate limiting may apply
- Voice search requires browser permission

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact & Support

For issues, questions, or suggestions:
- GitHub Issues: [Report an issue](https://github.com/yourusername/albumix)
- Email: contact@albumix.com

## 🙏 Credits

- **Spotify API** - For providing music data
- **React Community** - For amazing libraries and tools
- **Design Inspiration** - Apple Music, Spotify, and modern SaaS platforms

---

**Built with ❤️ for music lovers everywhere**

_This is a fan-made project and is not affiliated with Spotify AB._
