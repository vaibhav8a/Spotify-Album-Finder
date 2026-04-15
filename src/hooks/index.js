import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/helpers';

export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export const useInfiniteScroll = (callback, threshold = 0.8) => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            if ((scrollTop + windowHeight) / docHeight > threshold) {
                callback();
            }
        };

        const debouncedScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedScroll);

        return () => window.removeEventListener('scroll', debouncedScroll);
    }, [callback, threshold]);
};

export const useFetch = (fetchFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetch = async () => {
            try {
                setLoading(true);
                const result = await fetchFunction();
                if (mounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err);
                    setData(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetch();

        return () => {
            mounted = false;
        };
    }, dependencies);

    return { data, loading, error };
};
