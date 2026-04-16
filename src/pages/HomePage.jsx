import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { SearchBar, AlbumCard, SkeletonLoader } from '../components';
import { searchSpotify, getNewReleases } from '../services/spotifyApi';
import { useRecentlySearchedStore } from '../context/store';
import { useDebounce } from '../hooks';

export const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [newReleases, setNewReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const { recentSearches } = useRecentlySearchedStore();
    const { addSearch } = useRecentlySearchedStore();
    const debouncedQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        const loadNewReleases = async () => {
            try {
                setLoading(true);
                console.log('Starting to load new releases...');
                const releases = await getNewReleases(12);
                console.log('New releases loaded:', releases);
                console.log('Number of releases:', releases ? releases.length : 0);
                setNewReleases(releases || []);
            } catch (error) {
                console.error('Error loading new releases:', error);
                setNewReleases([]);
            } finally {
                setLoading(false);
            }
        };

        loadNewReleases();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addSearch(searchQuery);
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleRecentSearch = (query) => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 gradient-hero opacity-50 blur-3xl -z-10" />

                {/* Animated Background Shapes */}
                <div className="absolute inset-0 -z-10">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-72 h-72 rounded-full mix-blend-screen filter blur-3xl"
                            style={{
                                background:
                                    i % 2 === 0
                                        ? 'rgba(29, 185, 84, 0.3)'
                                        : 'rgba(139, 92, 246, 0.3)',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                x: [0, 100, 0],
                                y: [0, 50, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 15 + i * 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto px-4 text-center relative z-10"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                        Discover Your Next <span className="text-spotify">Favorite Album</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Search, explore, and save your favorite albums. Powered by Spotify.
                    </motion.p>

                    <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
                        <SearchBar
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSubmit={handleSearch}
                            placeholder="Search albums, artists, or songs..."
                        />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Recently Searched */}
            {recentSearches.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-4 py-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Recently Searched</h2>
                        <a href="#" className="text-spotify hover:text-green-400 flex items-center gap-2">
                            View All <FiArrowRight />
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {recentSearches.slice(0, 5).map((query) => (
                            <motion.button
                                key={query}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRecentSearch(query)}
                                className="px-4 py-2 glass rounded-full text-sm text-gray-300 hover:text-spotify hover:border-spotify transition-all"
                            >
                                {query}
                            </motion.button>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* New Releases */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">New Releases</h2>
                    <a
                        href="/search"
                        className="text-spotify hover:text-green-400 flex items-center gap-2"
                    >
                        Browse All <FiArrowRight />
                    </a>
                </div>

                {loading ? (
                    <SkeletonLoader count={6} type="album" />
                ) : newReleases.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {newReleases.map((album, index) => (
                            <AlbumCard key={album.id} album={album} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No albums loaded. Please try again later.</p>
                    </div>
                )}
            </section>

            {/* Mood Categories */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-white mb-6">Browse by Mood</h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {[
                        { name: 'Chill', color: 'from-blue-500 to-cyan-400' },
                        { name: 'Workout', color: 'from-red-500 to-orange-400' },
                        { name: 'Party', color: 'from-purple-500 to-pink-400' },
                        { name: 'Focus', color: 'from-indigo-500 to-blue-400' },
                        { name: 'Sleep', color: 'from-slate-500 to-indigo-400' },
                        { name: 'Happy', color: 'from-yellow-400 to-orange-300' },
                    ].map((mood, index) => (
                        <motion.div
                            key={mood.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, y: -8 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-6 rounded-lg bg-gradient-to-br ${mood.color} cursor-pointer hover:shadow-lg hover:shadow-current/30 transition-all`}
                        >
                            <h3 className="text-xl font-bold text-white">{mood.name}</h3>
                            <p className="text-sm text-white/80 mt-1">Explore albums</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};
