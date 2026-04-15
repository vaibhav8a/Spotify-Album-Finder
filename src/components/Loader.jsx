import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader = ({ count = 6, type = 'album' }) => {
    const items = Array.from({ length: count }, (_, i) => i);

    if (type === 'album') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((i) => (
                    <motion.div
                        key={i}
                        className="glass rounded-lg overflow-hidden p-4 space-y-4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="w-full aspect-square bg-gray-700 rounded-lg" />
                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                        <div className="flex gap-2">
                            <div className="h-6 bg-gray-700 rounded-full w-1/3" />
                            <div className="h-6 bg-gray-700 rounded-full w-1/4" />
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (type === 'track') {
        return (
            <div className="space-y-3">
                {items.map((i) => (
                    <motion.div
                        key={i}
                        className="glass rounded-lg p-4 flex gap-4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="w-12 h-12 bg-gray-700 rounded" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-2/3" />
                            <div className="h-3 bg-gray-700 rounded w-1/2" />
                        </div>
                        <div className="h-10 bg-gray-700 rounded w-10" />
                    </motion.div>
                ))}
            </div>
        );
    }

    return null;
};

export const ShimmerEffect = () => (
    <div className="animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:1000px_100%] h-full rounded" />
);
