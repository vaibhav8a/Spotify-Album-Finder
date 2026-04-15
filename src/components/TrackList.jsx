import React, { useState } from 'react';
import { FiPlay, FiPause, FiVolume2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

export const TrackList = ({ tracks, albumName = '' }) => {
    const [playingId, setPlayingId] = useState(null);
    const [audioElements, setAudioElements] = useState({});

    const handlePlayPause = (trackId, previewUrl) => {
        if (!previewUrl) return;

        if (playingId === trackId) {
            audioElements[trackId]?.pause();
            setPlayingId(null);
        } else {
            // Pause all other tracks
            Object.values(audioElements).forEach((audio) => audio?.pause());

            const audio = audioElements[trackId] || new Audio(previewUrl);
            audio.play().catch(() => console.log('Preview not available'));
            setAudioElements({
                ...audioElements,
                [trackId]: audio,
            });
            setPlayingId(trackId);
        }
    };

    if (!tracks || tracks.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No tracks available
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {tracks.map((track, index) => (
                <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-lg p-4 flex items-center gap-4 hover:glass-hover group"
                >
                    {/* Track Number */}
                    <div className="w-8 text-center font-semibold text-gray-400 group-hover:text-spotify">
                        {index + 1}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white line-clamp-1 group-hover:text-spotify transition-colors">
                            {track.name}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-1">
                            {track.artists?.map((a) => a.name).join(', ')}
                        </p>
                    </div>

                    {/* Duration */}
                    <div className="text-sm text-gray-400 w-12 text-right">
                        {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                    </div>

                    {/* Play Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayPause(track.id, track.preview_url)}
                        disabled={!track.preview_url}
                        className={`p-2 rounded-full transition-all ${track.preview_url
                                ? playingId === track.id
                                    ? 'bg-spotify text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-spotify hover:text-white'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            }`}
                        title={track.preview_url ? 'Preview track' : 'No preview available'}
                    >
                        {playingId === track.id ? <FiPause size={18} /> : <FiPlay size={18} />}
                    </motion.button>
                </motion.div>
            ))}
        </div>
    );
};
