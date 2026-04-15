import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
        { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: FiMail, href: 'mailto:contact@albumix.com', label: 'Email' },
    ];

    return (
        <footer className="bg-gradient-to-t from-spotify-dark to-transparent border-t border-gray-700/50 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Albumix</h3>
                        <p className="text-gray-400 text-sm">
                            Discover, explore, and share your favorite albums with Albumix. A modern music discovery platform built with React and Spotify API.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-spotify transition-colors">
                                    Browse Albums
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-spotify transition-colors">
                                    Trending Now
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-spotify transition-colors">
                                    My Favorites
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-spotify transition-colors">
                                    About Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-3">Follow Us</h4>
                        <div className="flex gap-4">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, color: '#1DB954' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-gray-400 hover:text-spotify transition-colors"
                                    title={label}
                                >
                                    <Icon size={24} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50 pt-8">
                    <p className="text-center text-gray-400 text-sm">
                        © {currentYear} Albumix. All rights reserved. | Powered by Spotify API
                    </p>
                    <p className="text-center text-gray-500 text-xs mt-2">
                        This is a fan-made project and is not affiliated with Spotify AB.
                    </p>
                </div>
            </div>
        </footer>
    );
};
