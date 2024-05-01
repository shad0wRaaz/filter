"use client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination"
import { useDashboardTable } from "@/contexts/DashboardTableContext";
import { useEffect, useState } from "react";

const TablePagination = () => {
  const {currentPage, setCurrentPage, itemsPerPage, tableData, setTableData} = useDashboardTable();
  
  const totalPages = Math.ceil(tableData?.length / itemsPerPage);
console.log(totalPages)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData?.slice(startIndex, endIndex);
  useEffect(() => {
    console.log(currentItems)
     setTableData(currentItems)

  }, [])

  return (
    <Pagination className="py-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={(cur) => cur - 1}/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(cur => cur + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  )
}

export default TablePagination