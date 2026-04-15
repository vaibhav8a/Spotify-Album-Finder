# 🚀 Albumix Setup Guide

Complete step-by-step guide to set up and run the Albumix music discovery platform.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repo)
- A **Spotify Developer Account** (free)

## Step 1: Spotify Developer Setup

### 1.1 Create a Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Log In" or create a new account
3. Accept the Spotify Developer Terms and create your profile

### 1.2 Create an Application

1. In the Dashboard, click "Create an App"
2. Enter an app name (e.g., "Albumix")
3. Accept the terms and create the app
4. You'll see your **Client ID** and **Client Secret**

⚠️ **Important**: Never share your Client Secret publicly!

### 1.3 Copy Your Credentials

1. Copy your **Client ID**
2. Click "Show Client Secret" and copy your **Client Secret**
3. Keep these safe - you'll need them in the next step

## Step 2: Project Setup

### 2.1 Navigate to Project Directory

```bash
cd /Users/vaibhavsrivastava/Documents/Spotify_albumfinder
```

### 2.2 Create Environment File

1. Look for `.env.example` in the project root
2. Create a new file called `.env` (copy from `.env.example` if it exists)
3. Add your Spotify credentials:

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

Replace `your_client_id_here` and `your_client_secret_here` with your actual credentials.

### 2.3 Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Zustand
- And more...

**Installation Time**: Usually 2-5 minutes depending on your internet

## Step 3: Start the Development Server

### 3.1 Run the App

```bash
npm start
```

The app will automatically open in your default browser at `http://localhost:3000`

### 3.2 If It Doesn't Open Automatically

Open your browser and navigate to:
```
http://localhost:3000
```

## Step 4: First Time Setup

### 4.1 Testing the App

1. The app should load with the home page
2. Try searching for an album or artist
3. Click on an album to view details
4. Try adding albums to favorites

### 4.2 If You Get API Errors

If you see API-related errors:

1. **Check your .env file** - Make sure credentials are correct
2. **Spotify API Status** - Check [Spotify Developer Status](https://developer.spotify.com/status)
3. **Rate Limiting** - The Spotify API has rate limits; wait a moment and try again
4. **Network Issues** - Check your internet connection

## Step 5: Building for Production

When you're ready to deploy:

### 5.1 Create Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### 5.2 Deploy to Hosting

#### Option A: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Option B: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option C: GitHub Pages
1. Add to `package.json`: `"homepage": "https://yourusername.github.io/albumix"`
2. Run: `npm run build`
3. Deploy the `build/` folder

## Troubleshooting

### Problem: "npm: command not found"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Problem: Dependencies Installation Fails

**Solution**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules folder
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Reinstall
npm install
```

### Problem: "REACT_APP_SPOTIFY_CLIENT_ID is not defined"

**Solution**:
1. Make sure you created a `.env` file (not `.env.example`)
2. Add your actual Spotify credentials
3. Restart the dev server (`npm start`)

### Problem: "Failed to get access token"

**Solution**:
1. Verify your Client ID and Secret are correct
2. Check if your Spotify app credentials are still valid
3. Try regenerating your credentials in Spotify Dashboard

### Problem: Port 3000 Already in Use

**Solution**:
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### Problem: App Starts but No Albums Load

**Solution**:
1. Check browser console (F12 → Console tab) for errors
2. Make sure you have internet connection
3. Verify Spotify API credentials
4. Check Spotify API status page

## Development Commands

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (⚠️ cannot be undone)
npm run eject
```

## Environment Variables Explained

### REACT_APP_SPOTIFY_CLIENT_ID
- Your Spotify application's unique identifier
- Used to authenticate API requests

### REACT_APP_SPOTIFY_CLIENT_SECRET
- Your Spotify application's secret key
- ⚠️ Keep this private - never commit to GitHub!

### REACT_APP_SPOTIFY_REDIRECT_URI
- URL where users are redirected after authentication
- For local development: `http://localhost:3000/callback`

## File Structure

```
Spotify_albumfinder/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API integration
│   ├── context/        # State management
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── App.jsx         # Main app component
│   ├── index.jsx       # Entry point
│   └── index.css       # Global styles
├── public/
│   └── index.html      # HTML template
├── package.json        # Dependencies
├── .env                # Environment variables (create this)
├── .env.example        # Example env file
└── README.md          # Project documentation
```

## Next Steps

### Getting Familiar with the App

1. Explore the home page
2. Try searching for your favorite artist
3. Check out the album details page
4. Save some albums to favorites
5. View the about page

### Customization

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Animations**: Modify `src/index.css` for animation speeds
- **API Calls**: Update `src/services/spotifyApi.js` for different endpoints

### Performance Optimization

- Lazy loading is enabled for album images
- Debounced search to reduce API calls
- Cached Spotify tokens with expiration

## Common Features to Try

1. **Search Albums**: Try searching "The Beatles", "Thriller", etc.
2. **Filter Results**: Sort by year, popularity, and more
3. **Play Previews**: Click the play button on tracks
4. **Add Favorites**: Heart button on album cards
5. **Open in Spotify**: Link to open albums in Spotify app

## Performance Tips

1. **Clear Browser Cache** if seeing old versions
2. **Check Network Tab** in DevTools for slow requests
3. **Monitor API Rate Limits** - Spotify has usage limits
4. **Use Production Build** for deployment (smaller file size)

## Getting Help

### Resources
- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)

### Debugging
1. Open Browser DevTools: `F12` or `Cmd+Option+I` (Mac)
2. Check Console tab for errors
3. Check Network tab for API failures
4. Look at Application tab for LocalStorage data

## Security Notes

- Never commit `.env` file to GitHub
- Use `.env.example` as a template for documentation
- Rotate your Spotify credentials regularly
- Use HTTPS for production deployments

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review browser console errors
3. Check Spotify API status
4. Ensure internet connection

---

**Happy Music Exploring! 🎵**

For more information, see [README.md](./README.md)
