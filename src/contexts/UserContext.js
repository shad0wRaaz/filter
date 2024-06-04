"use client";
import useActivityListener from '@/hooks/useActivityListener';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    useActivityListener();
    const [user, setUser] = useState({ email: '', secretKey: '', apiKey: ''});

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};