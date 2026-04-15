import React from 'react';
import { FiSliders, FiArrowUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const FilterBar = ({
    sortBy,
    onSortChange,
    yearRange,
    onYearChange,
    popularityRange,
    onPopularityChange
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-4 mb-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sort */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <FiArrowUp size={16} />
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-spotify focus:outline-none focus:ring-2 focus:ring-spotify transition-all"
                    >
                        <option value="popularity">Most Popular</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Alphabetical</option>
                    </select>
                </div>

                {/* Year Filter */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <FiSliders size={16} />
                        Year
                    </label>
                    <input
                        type="number"
                        value={yearRange}
                        onChange={(e) => onYearChange(e.target.value)}
                        placeholder="Filter by year..."
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-spotify focus:outline-none focus:ring-2 focus:ring-spotify transition-all"
                    />
                </div>

                {/* Popularity Filter */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <FiSliders size={16} />
                        Min Popularity
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={popularityRange}
                        onChange={(e) => onPopularityChange(e.target.value)}
                        placeholder="0-100"
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-spotify focus:outline-none focus:ring-2 focus:ring-spotify transition-all"
                    />
                </div>

                {/* Clear Filters */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300">&nbsp;</label>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            onSortChange('popularity');
                            onYearChange('');
                            onPopularityChange('');
                        }}
                        className="px-3 py-2 bg-gray-700 hover:bg-spotify text-white rounded-lg transition-colors font-semibold"
                    >
                        Clear Filters
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
