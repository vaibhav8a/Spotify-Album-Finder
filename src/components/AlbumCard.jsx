import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoriteButton } from './FavoriteButton';
import { formatDate, getYear, getPlaceholderImage } from '../utils/helpers';

export const AlbumCard = ({ album, index = 0 }) => {
    const imageUrl = album.images?.[0]?.url || getPlaceholderImage();

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
            },
        },
        hover: {
            y: -8,
            transition: { duration: 0.2 },
        },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="group"
        >
            <Link to={`/album/${album.id}`}>
                <div className="glass rounded-lg overflow-hidden hover:glass-hover transition-all duration-300 h-full flex flex-col cursor-pointer">
                    {/* Album Image */}
                    <div className="relative overflow-hidden bg-gray-700 aspect-square">
                        <motion.img
                            src={imageUrl}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-spotify rounded-full font-semibold text-white text-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                View Details
                            </motion.button>
                        </div>
                        {/* Favorite Button */}
                        <div className="absolute top-2 right-2 z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <FavoriteButton album={album} />
                            </motion.div>
                        </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            <h3 className="font-bold text-white line-clamp-2 group-hover:text-spotify transition-colors">
                                {album.name}
                            </h3>
                            <p className="text-sm text-gray-300 line-clamp-1">
                                {album.artists?.[0]?.name || 'Unknown Artist'}
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs px-2 py-1 bg-spotify/20 text-spotify rounded-full">
                                {getYear(album.release_date)}
                            </span>
                            {album.popularity && (
                                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                    {album.popularity}%
                                </span>
                            )}
                            {album.total_tracks && (
                                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                                    {album.total_tracks} tracks
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
