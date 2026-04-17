import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar, AlbumCard, FilterBar, SkeletonLoader } from '../components';
import { searchSpotify } from '../services/spotifyApi';
import { sortAlbums, filterByYear, filterByPopularity } from '../utils/helpers';

export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(query);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('popularity');
    const [yearFilter, setYearFilter] = useState('');
    const [popularityFilter, setPopularityFilter] = useState('');

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setAlbums([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const results = await searchSpotify(query, 'album', 20);
                setAlbums(results.albums?.items || []);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to search albums. Please try again.');
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery });
        }
    };

    // Apply filters and sorting
    let filteredAlbums = [...albums];
    if (yearFilter) {
        filteredAlbums = filterByYear(filteredAlbums, parseInt(yearFilter));
    }
    if (popularityFilter) {
        filteredAlbums = filterByPopularity(filteredAlbums, parseInt(popularityFilter));
    }
    filteredAlbums = sortAlbums(filteredAlbums, sortBy);

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

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onSubmit={handleSearch}
                        loading={loading}
                    />
                </motion.div>

                {/* Results Header */}
                {query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Results for <span className="text-spotify">"{query}"</span>
                        </h1>
                        <p className="text-gray-400">
                            {loading ? 'Searching...' : `Found ${filteredAlbums.length} album${filteredAlbums.length !== 1 ? 's' : ''}`}
                        </p>
                    </motion.div>
                )}

                {/* Filter Bar */}
                {!loading && albums.length > 0 && (
                    <FilterBar
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        yearRange={yearFilter}
                        onYearChange={setYearFilter}
                        popularityRange={popularityFilter}
                        onPopularityChange={setPopularityFilter}
                    />
                )}

                {/* Results Grid */}
                {loading ? (
                    <SkeletonLoader count={12} type="album" />
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <p className="text-red-400 text-lg">{error}</p>
                    </motion.div>
                ) : filteredAlbums.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="glass rounded-lg p-8 max-w-md mx-auto">
                            <p className="text-gray-400 text-lg mb-2">
                                {query ? 'No albums found' : 'Enter a search query to get started'}
                            </p>
                            {query && (
                                <p className="text-gray-500 text-sm">
                                    Try searching for a different artist or album name
                                </p>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredAlbums.map((album, index) => (
                            <AlbumCard key={album.id} album={album} index={index} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
