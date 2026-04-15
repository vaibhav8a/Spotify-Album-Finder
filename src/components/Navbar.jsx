import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiHeart, FiInfo, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const Navbar = ({ isDark, onThemeToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: '/', icon: FiHome },
        { label: 'Search', href: '/search', icon: FiSearch },
        { label: 'Favorites', href: '/favorites', icon: FiHeart },
        { label: 'About', href: '/about', icon: FiInfo },
    ];

    return (
        <nav className="glass sticky top-0 z-50 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-spotify to-green-600 flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-spotify/50 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            A
                        </motion.div>
                        <span className="text-xl font-bold text-white hidden sm:block group-hover:text-spotify transition-colors">
                            Albumix
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <motion.div key={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-spotify/10 hover:text-spotify transition-all"
                                >
                                    <Icon size={20} />
                                    <span className="text-sm">{label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onThemeToggle}
                            className="p-2 rounded-lg hover:bg-gray-700 transition-all text-gray-300 hover:text-white"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-all text-gray-300 hover:text-white"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-700/50"
                        >
                            <div className="py-4 space-y-2">
                                {navItems.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        to={href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-spotify/10 hover:text-spotify transition-all"
                                    >
                                        <Icon size={20} />
                                        <span>{label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
