"use client";
import { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const useMySession = () => useContext(SessionContext);

export const MySessionProvider = ({ children }) => {
    const [session, setSession] = useState({email : '', usename: ''});

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};