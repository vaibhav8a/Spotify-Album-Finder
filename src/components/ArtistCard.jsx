import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPlaceholderImage } from '../utils/helpers';

export const ArtistCard = ({ artist, index = 0 }) => {
    const imageUrl = artist.images?.[0]?.url || getPlaceholderImage();

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
        >
            <div className="glass rounded-lg overflow-hidden hover:glass-hover transition-all duration-300 text-center p-6">
                {/* Artist Image */}
                <div className="mb-4 relative overflow-hidden rounded-full w-full aspect-square mx-auto">
                    <motion.img
                        src={imageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Artist Info */}
                <h3 className="font-bold text-white line-clamp-1 hover:text-spotify transition-colors">
                    {artist.name}
                </h3>

                {artist.genres && artist.genres.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                        {artist.genres[0]}
                    </p>
                )}

                {artist.popularity && (
                    <span className="inline-block text-xs px-2 py-1 bg-spotify/20 text-spotify rounded-full mt-3">
                        {artist.popularity}% Popular
                    </span>
                )}
            </div>
        </motion.div>
    );
};
