"use client";
import { createContext, useContext, useState } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
    const [watchlistNames, setWatchlistNames] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    return (
        <WatchlistContext.Provider value={{ watchlist, setWatchlist, watchlistNames, setWatchlistNames }}>
            {children}
        </WatchlistContext.Provider>
    );
};