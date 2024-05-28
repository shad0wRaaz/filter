"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState({ 
        searchQuery: "", 
        accountNature: "All", 
        trackRecord: 6,
        minGrowth:  1,
        maxGrowth: 5000,
        minWinRatio: 0,
        maxWinRatio: 100,
        minBalance: 0,
        minDrawdown: 0,
        maxDrawdown: 100,
        minRiskRewardAverage: 0,
        maxRiskRewardAverage: 10,
        minRiskRewardWorst: 0,
        maxRiskRewardWorst: 10,
        broker: "All"
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