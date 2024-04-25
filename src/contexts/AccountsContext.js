"use client";
import { createContext, useContext, useState } from 'react';

const AccountsContext = createContext();

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({ children }) => {
    const [allAccounts, setAllAccounts] = useState([]);

    return (
        <AccountsContext.Provider value={{ allAccounts, setAllAccounts }}>
            {children}
        </AccountsContext.Provider>
    );
};