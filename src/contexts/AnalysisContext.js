"use client";
import { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => useContext(AnalysisContext);

export const AnalysisProvider = ({ children }) => {
    const [analysis, setAnalysis] = useState([]);

    return (
        <AnalysisContext.Provider value={{ analysis, setAnalysis }}>
            {children}
        </AnalysisContext.Provider>
    );
};