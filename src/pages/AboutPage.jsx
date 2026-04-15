import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode, FiLayout, FiLayers } from 'react-icons/fi';

export const AboutPage = () => {
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
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold text-white mb-4">About Albumix</h1>
                    <p className="text-xl text-gray-300">
                        A modern music discovery platform powered by Spotify
                    </p>
                </motion.div>

                {/* Project Overview */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* What is Albumix */}
                    <motion.div variants={itemVariants} className="glass rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-spotify mb-4">What is Albumix?</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Albumix is a sleek, modern web application designed to help music lovers discover,
                            explore, and save their favorite albums. Built with cutting-edge technologies and
                            powered by the Spotify API, Albumix provides a premium user experience for music
                            discovery.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Whether you're searching for a specific album, browsing by mood, or exploring new
                            releases, Albumix makes it easy to find and save your favorite music in one beautiful
                            interface.
                        </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div variants={itemVariants} className="glass rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-spotify mb-6">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Advanced Search', desc: 'Search albums, artists, and songs instantly' },
                                { title: 'Album Details', desc: 'View comprehensive info about any album' },
                                { title: 'Track Previews', desc: 'Listen to 30-second previews of songs' },
                                { title: 'Save Favorites', desc: 'Store your favorite albums locally' },
                                { title: 'Trending Albums', desc: 'Discover new releases and trending music' },
                                { title: 'Filter & Sort', desc: 'Customize results by year, popularity, and more' },
                            ].map((feature, index) => (
                                <div key={index} className="border-l-2 border-spotify pl-4">
                                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div variants={itemVariants} className="glass rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-spotify mb-6">Tech Stack</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: FiCode,
                                    title: 'Frontend',
                                    tech: ['React 18', 'React Router', 'Tailwind CSS', 'Framer Motion'],
                                },
                                {
                                    icon: FiLayers,
                                    title: 'State Management',
                                    tech: ['Zustand', 'LocalStorage', 'Context API'],
                                },
                                {
                                    icon: FiLayout,
                                    title: 'Design & API',
                                    tech: ['Spotify Web API', 'React Icons', 'Chart.js'],
                                },
                            ].map((category, index) => {
                                const Icon = category.icon;
                                return (
                                    <div key={index} className="border border-spotify/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon className="text-spotify" size={24} />
                                            <h3 className="font-semibold text-white">{category.title}</h3>
                                        </div>
                                        <ul className="space-y-1">
                                            {category.tech.map((item, idx) => (
                                                <li key={idx} className="text-sm text-gray-400">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Getting Started */}
                    <motion.div variants={itemVariants} className="glass rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-spotify mb-4">Getting Started</h2>
                        <ol className="space-y-3 text-gray-300">
                            <li className="flex gap-3">
                                <span className="text-spotify font-bold">1.</span>
                                <span>Get a Spotify API key from the Spotify Developer Dashboard</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-spotify font-bold">2.</span>
                                <span>Add your credentials to the .env file</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-spotify font-bold">3.</span>
                                <span>Install dependencies with npm install</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-spotify font-bold">4.</span>
                                <span>Start the development server with npm start</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-spotify font-bold">5.</span>
                                <span>Begin discovering music!</span>
                            </li>
                        </ol>
                    </motion.div>

                    {/* Repository & Links */}
                    <motion.div variants={itemVariants} className="glass rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-spotify mb-6">Get Involved</h2>
                        <p className="text-gray-300 mb-6">
                            Albumix is a passion project built to showcase modern web development practices and
                            music API integration.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-spotify hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                <FiGithub /> GitHub Repository
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-spotify text-spotify hover:bg-spotify/10 font-semibold rounded-lg transition-colors"
                            >
                                <FiExternalLink /> View Live Demo
                            </a>
                        </div>
                    </motion.div>

                    {/* Credits */}
                    <motion.div variants={itemVariants} className="text-center py-8">
                        <p className="text-gray-400 text-sm mb-2">
                            Built with ❤️ for music lovers everywhere
                        </p>
                        <p className="text-gray-500 text-xs">
                            This is a fan-made project and is not affiliated with Spotify AB.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
