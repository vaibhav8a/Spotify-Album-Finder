import React from 'react';
import { FiSearch, FiMic } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const SearchBar = ({ value, onChange, onSubmit, loading = false, placeholder = 'Search albums, artists, songs...' }) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div
                className={`relative flex items-center gap-3 px-5 py-3 rounded-full glass transition-all duration-300 ${isFocused ? 'ring-2 ring-spotify shadow-lg shadow-spotify/30' : ''
                    }`}
            >
                <FiSearch className="text-gray-400" size={20} />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 w-full"
                />
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-spotify/20 rounded-full transition-colors"
                    title="Voice search"
                >
                    <FiMic size={20} className="text-gray-400 hover:text-spotify" />
                </motion.button>
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="px-5 py-2 bg-spotify hover:bg-green-600 disabled:bg-gray-600 rounded-full font-semibold transition-colors text-white text-sm"
                >
                    {loading ? 'Searching...' : 'Search'}
                </motion.button>
            </div>
        </motion.form>
    );
};
