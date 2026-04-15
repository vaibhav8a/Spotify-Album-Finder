# ⚡ Quick Start Guide - Albumix

Get Albumix running in 5 minutes!

## 🎯 5-Minute Setup

### Step 1: Get Spotify Credentials (2 min)
1. Go to https://developer.spotify.com/dashboard
2. Log in or sign up (free)
3. Create an app
4. Copy your Client ID and Client Secret

### Step 2: Configure Environment (1 min)
```bash
cd /Users/vaibhavsrivastava/Documents/Spotify_albumfinder
```

Create `.env` file:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_secret_here
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### Step 3: Install & Run (2 min)
```bash
npm install
npm start
```

🎉 **Done!** App opens at http://localhost:3000

---

## 💡 What to Try First

1. **Search** - Try searching "The Beatles" or "Thriller"
2. **Browse** - Scroll through new releases
3. **Preview** - Click play on any track
4. **Favorite** - Heart an album (it saves!)
5. **Details** - Click any album for full info

---

## ❓ Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### No albums showing?
- Check your `.env` file has correct credentials
- Restart the app (Ctrl+C, then npm start)
- Open DevTools (F12) and check Console for errors

### Port 3000 in use?
```bash
PORT=3001 npm start
```

---

## 📁 Quick Navigation

- **Home**: http://localhost:3000
- **Search**: http://localhost:3000/search
- **Favorites**: http://localhost:3000/favorites
- **About**: http://localhost:3000/about

---

## 🔗 Important Links

- 📖 [Full Documentation](./DOCUMENTATION.md)
- 📚 [Setup Guide](./SETUP.md)
- 📖 [README](./README.md)
- 🎨 [Spotify API Docs](https://developer.spotify.com/documentation/web-api)

---

## 📞 Need More Help?

1. Check [SETUP.md](./SETUP.md) for detailed setup
2. See [DOCUMENTATION.md](./DOCUMENTATION.md) for features
3. Read [README.md](./README.md) for full info

---

**Happy Exploring! 🎵**
