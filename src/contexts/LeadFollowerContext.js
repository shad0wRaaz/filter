"use client";
import { createContext, useContext, useState } from 'react';

const LeadFollower = createContext();

export const useLeadFollower = () => useContext(LeadFollower);

export const LeadFollowerProvider = ({ children }) => {
    const [leadFollower, setLeadFollower] = useState([]);
    const [leadsOnlyArray, setLeadsOnlyArray] = useState([]);
    const [followersOnlyArray, setFollowersOnlyArray] = useState([]);

    return (
        <LeadFollower.Provider value={{ leadFollower, setLeadFollower, leadsOnlyArray, setLeadsOnlyArray, followersOnlyArray, setFollowersOnlyArray }}>
            {children}
        </LeadFollower.Provider>
    );
};