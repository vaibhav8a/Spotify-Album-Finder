// Format date to readable format
export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

// Get year from date
export const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
        return new Date(dateString).getFullYear();
    } catch (error) {
        return dateString;
    }
};

// Format large numbers (e.g., 1000 -> 1K)
export const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Debounce function for search
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Extract dominant color from image (simplified)
export const extractDominantColor = (imageUrl) => {
    return '#1DB954'; // Fallback to Spotify green
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// Sort albums by different criteria
export const sortAlbums = (albums, sortBy = 'popularity') => {
    const sorted = [...albums];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        case 'popularity':
            return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
};

// Filter albums by year
export const filterByYear = (albums, year) => {
    if (!year) return albums;
    return albums.filter((album) => getYear(album.release_date) === year);
};

// Filter albums by popularity
export const filterByPopularity = (albums, minPopularity) => {
    if (!minPopularity) return albums;
    return albums.filter((album) => (album.popularity || 0) >= minPopularity);
};

// Get mood categories
export const getMoodCategories = () => [
    { id: 'chill', name: 'Chill', color: 'from-blue-500 to-cyan-400' },
    { id: 'workout', name: 'Workout', color: 'from-red-500 to-orange-400' },
    { id: 'party', name: 'Party', color: 'from-purple-500 to-pink-400' },
    { id: 'focus', name: 'Focus', color: 'from-indigo-500 to-blue-400' },
    { id: 'sleep', name: 'Sleep', color: 'from-slate-500 to-indigo-400' },
    { id: 'happy', name: 'Happy', color: 'from-yellow-400 to-orange-300' },
];

// Validate Spotify URL
export const isValidSpotifyUrl = (url) => {
    return url && url.includes('spotify.com');
};

// Get placeholder image
export const getPlaceholderImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect fill="%231e293b" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23a1aebf" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
};
