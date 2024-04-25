"use client";
import { createContext, useContext, useState } from 'react';

const CopyTradeContext = createContext();

export const useCopyTrade = () => useContext(CopyTradeContext);

export const CopyTradeProvider = ({ children }) => {
    const [master, setMaster] = useState('');
    const [slaves, setSlaves] = useState([]);

    return (
        <CopyTradeContext.Provider value={{ master, setMaster, slaves, setSlaves }}>
            {children}
        </CopyTradeContext.Provider>
    );
};