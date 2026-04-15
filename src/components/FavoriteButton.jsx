import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { useFavoritesStore } from '../context/store';
import { motion } from 'framer-motion';

export const FavoriteButton = ({ album, className = '' }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
    const favorited = isFavorite(album.id);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (favorited) {
            removeFavorite(album.id);
        } else {
            addFavorite(album);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={`p-2 rounded-full transition-all duration-200 ${favorited
                    ? 'bg-spotify text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-spotify hover:text-white'
                } ${className}`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            {favorited ? <FiHeart size={20} fill="currentColor" /> : <FiHeart size={20} />}
        </motion.button>
    );
};
