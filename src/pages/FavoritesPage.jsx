import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { AlbumCard } from '../components';
import { useFavoritesStore } from '../context/store';
import { Link } from 'react-router-dom';

export const FavoritesPage = () => {
    const { favorites, clearFavorites } = useFavoritesStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
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
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <FiHeart className="text-spotify" size={32} fill="currentColor" />
                                <h1 className="text-4xl font-bold text-white">My Favorites</h1>
                            </div>
                            <p className="text-gray-400">
                                {favorites.length} album{favorites.length !== 1 ? 's' : ''} saved
                            </p>
                        </div>

                        {favorites.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={clearFavorites}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
                            >
                                Clear All
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Empty State */}
                {favorites.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="glass rounded-lg p-12 max-w-md mx-auto">
                            <div className="text-6xl mb-4">💔</div>
                            <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
                            <p className="text-gray-400 mb-6">
                                Start exploring and add your favorite albums to save them here.
                            </p>
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-spotify hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Browse Albums <FiArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {favorites.map((album, index) => (
                            <AlbumCard key={album.id} album={album} index={index} />
                        ))}
                    </motion.div>
                )}

                {/* Suggestions */}
                {favorites.length > 0 && favorites.length < 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 glass rounded-lg p-6 text-center"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Discover More Albums
                        </h3>
                        <p className="text-gray-400 mb-4">
                            You have {5 - favorites.length} more slot{5 - favorites.length !== 1 ? 's' : ''} before reaching 5 favorites.
                        </p>
                        <Link
                            to="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-spotify hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Explore More <FiArrowRight />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
