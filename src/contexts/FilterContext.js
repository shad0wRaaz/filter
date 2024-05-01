"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState({ 
        searchQuery: "",
        accountType: "Real", 
        accountNature: "All", 
        trackRecord: 3,
        profitability:  -100,
        minWinRatio: 0,
        maxWinRatio: 100,
        minBalance: 0,
        maxDrawdown: 100,
        riskRewardAverage: 0,
        riskRewardWorst: 0,
        minCopier: 0
    });

    useEffect(() => {
        let savedFilters;
        savedFilters = JSON.parse(localStorage.getItem("filters"));
        if(savedFilters){
            setFilter({ ...savedFilters });
        }
    }, []);
    

    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    );
};