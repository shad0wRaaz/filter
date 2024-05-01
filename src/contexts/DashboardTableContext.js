"use client";
import { createContext, useContext, useState } from 'react';

const DashboardTableContext = createContext();

export const useDashboardTable = () => useContext(DashboardTableContext);

export const DashboardTableProvider = ({ children }) => {
    const [tableData, setTableData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);


    return (
        <DashboardTableContext.Provider value={{ initialData, setInitialData, tableData, setTableData, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage}}>
            {children}
        </DashboardTableContext.Provider>
    );
};