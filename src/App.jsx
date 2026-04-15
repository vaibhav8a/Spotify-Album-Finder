import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Footer } from './components';
import { HomePage, SearchPage, AlbumDetailsPage, FavoritesPage, AboutPage } from './pages';
import { getAccessToken } from './services/spotifyApi';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [tokenInitialized, setTokenInitialized] = useState(false);

    useEffect(() => {
        // Initialize Spotify token on app load
        const initializeToken = async () => {
            try {
                await getAccessToken();
                setTokenInitialized(true);
            } catch (error) {
                console.error('Failed to initialize Spotify token:', error);
                // You might want to show a toast notification here
            }
        };

        initializeToken();
    }, []);

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
        // You can add more theme switching logic here
    };

    return (
        <Router>
            <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'}`}>
                <Navbar isDark={isDarkMode} onThemeToggle={handleThemeToggle} />

                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/album/:albumId" element={<AlbumDetailsPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AnimatePresence>

                <Footer />
            </div>
        </Router>
    );
}

const NotFoundPage = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
    >
        <div className="text-center glass rounded-lg p-12 max-w-md">
            <div className="text-6xl mb-4">🎵</div>
            <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-gray-400 mb-6">
                This page doesn't exist. Let's get you back to discovering music!
            </p>
            <a
                href="/"
                className="inline-block px-6 py-3 bg-spotify hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
                Go Home
            </a>
        </div>
    </motion.div>
);

export default App;
