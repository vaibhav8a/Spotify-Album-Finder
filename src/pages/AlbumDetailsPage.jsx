import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { FavoriteButton, TrackList, SkeletonLoader } from '../components';
import { getAlbumDetails, getAlbumTracks, getArtistAlbums } from '../services/spotifyApi';
import { formatDate, getPlaceholderImage } from '../utils/helpers';
import { useRecentlyViewedStore } from '../context/store';

export const AlbumDetailsPage = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const { addViewed } = useRecentlyViewedStore();

    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAlbumDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const albumData = await getAlbumDetails(albumId);
                setAlbum(albumData);
                addViewed(albumData);

                const tracksData = await getAlbumTracks(albumId);
                setTracks(tracksData);

                if (albumData.artists?.[0]?.id) {
                    const artistAlbumsData = await getArtistAlbums(albumData.artists[0].id, 6);
                    setArtistAlbums(artistAlbumsData);
                }
            } catch (err) {
                console.error('Error loading album details:', err);
                setError('Failed to load album details');
            } finally {
                setLoading(false);
            }
        };

        loadAlbumDetails();
    }, [albumId, addViewed]);

    if (loading) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <SkeletonLoader count={1} type="album" />
                </div>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-spotify hover:text-green-400 mb-6"
                    >
                        <FiArrowLeft /> Go Back
                    </motion.button>
                    <div className="glass rounded-lg p-8 text-center">
                        <p className="text-red-400 text-lg">{error || 'Album not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = album.images?.[0]?.url || getPlaceholderImage();
    const artist = album.artists?.[0];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-spotify hover:text-green-400 mb-6 group"
                >
                    <FiArrowLeft className="group-hover:translate-x-[-4px] transition-transform" /> Go Back
                </motion.button>

                {/* Album Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                >
                    {/* Album Cover */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1"
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-2xl shadow-spotify/20">
                            <motion.img
                                src={imageUrl}
                                alt={album.name}
                                className="w-full aspect-square object-cover"
                                whileHover={{ scale: 1.05 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Album Actions */}
                        <div className="flex gap-3 mt-6">
                            <FavoriteButton album={album} className="flex-1" />
                            <motion.a
                                href={album.external_urls?.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-4 py-2 bg-spotify hover:bg-green-600 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                            >
                                Open on Spotify <FiExternalLink size={16} />
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Album Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div>
                            <span className="text-sm font-semibold text-spotify uppercase tracking-wider">Album</span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 leading-tight">
                                {album.name}
                            </h1>
                        </div>

                        {/* Artist */}
                        {artist && (
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Artist</p>
                                <motion.h2
                                    whileHover={{ x: 5 }}
                                    className="text-2xl font-bold text-spotify cursor-pointer"
                                >
                                    {artist.name}
                                </motion.h2>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                            <div className="glass rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Release Date</p>
                                <p className="text-white font-semibold mt-1">{formatDate(album.release_date)}</p>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Tracks</p>
                                <p className="text-white font-semibold mt-1">{album.total_tracks}</p>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Popularity</p>
                                <p className="text-spotify font-semibold mt-1">{album.popularity}%</p>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Label</p>
                                <p className="text-white font-semibold mt-1 text-sm line-clamp-1">
                                    {album.label || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Genres */}
                        {album.genres && album.genres.length > 0 && (
                            <div>
                                <p className="text-gray-400 text-sm mb-2">Genres</p>
                                <div className="flex flex-wrap gap-2">
                                    {album.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 bg-spotify/20 text-spotify rounded-full text-sm capitalize"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Tracks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
                    <TrackList tracks={tracks} albumName={album.name} />
                </motion.div>

                {/* Related Albums */}
                {artistAlbums.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">More by {artist?.name}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artistAlbums.map((relatedAlbum) => (
                                <motion.div
                                    key={relatedAlbum.id}
                                    whileHover={{ y: -8 }}
                                    onClick={() => navigate(`/album/${relatedAlbum.id}`)}
                                    className="cursor-pointer"
                                >
                                    <div className="glass rounded-lg overflow-hidden hover:glass-hover transition-all">
                                        <img
                                            src={relatedAlbum.images?.[0]?.url || getPlaceholderImage()}
                                            alt={relatedAlbum.name}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="p-3">
                                            <h3 className="font-semibold text-white line-clamp-1">
                                                {relatedAlbum.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                {new Date(relatedAlbum.release_date).getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
