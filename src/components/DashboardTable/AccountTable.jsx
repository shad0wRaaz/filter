import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableCell, TableBody,  TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination"
import { Skeleton } from '../ui/skeleton'
import { Toaster, toast } from 'sonner'
import AccountTableItem from './AccountTableItem'
import { useFilter } from '@/contexts/FilterContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, dateDifference } from '@/lib/utils'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'
import Loader from '../Loader'
import TablePagination from '../Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronUp } from 'lucide-react'

const style = {
  headerStyle: "flex justify-between items-center",
  iconStyle: "w-4 h-4 transition-all cursor-pointer duration-500"
}

const AccountTable = ({ data, isLoading, status, type }) => {
  const { filter } = useFilter();
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { leadFollower,followersOnlyArray, leadsOnlyArray} = useLeadFollower();
  const [sort, setSort] = useState({key: 'balance', order: true})
  // console.log("unfiltered data", data)
  
  useMemo(() => {
  if(!data) return

    let filteredData = data;
    if(filter.accountNature == "Lead"){
      filteredData = filteredData.filter(account => leadsOnlyArray.find(lead => lead == account.id));
    }else if(filter.accountNature == "Follower"){
      filteredData = filteredData.filter(account => followersOnlyArray.find(follower => follower == account.id));
    }else if(filter.accountNature == "Standalone"){
      filteredData = filteredData.filter(account => !followersOnlyArray.find(follower => follower == account.id) && !leadsOnlyArray.find(lead => lead == account.id));
    }
    
    filteredData = filteredData?.filter(account => 
        (String(account.client_name).toLowerCase().indexOf(filter.searchQuery) >= 0  || (String(account.account_number).indexOf(filter.searchQuery)) >= 0 )&&
        Number(account.growth) >= Number(filter.profitability) &&
        (String(account.trade_mode).toLowerCase() == String(filter.accountType).toLowerCase() || String(filter.accountType).toLowerCase() == "all") &&
        Number(account.win_ratio) >= filter.minWinRatio && Number(account.win_ratio < filter.maxWinRatio) &&
        Number(account.risk_reward_ratio_avg) >= Number(filter.riskRewardAverage) && 
        Number(account.risk_reward_ratio_worst) >= Number(filter.riskRewardWorst) &&
        Number(account.balance) >= Number(filter.minBalance) &&
        Number(account.drawdown <= Number(filter.maxDrawdown))
        // dateDifference(account.start_date) <= Number(filter.trackRecord) * 30
      );

      setFilteredData(filteredData)

    return() => {}
}, [data, filter]);

useEffect(() => {
  if(!filteredData) return;
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  setTotalPages(totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedArray = handleSort(filteredData, sort.key, sort.order);
  const currentItems = sortedArray?.slice(startIndex, endIndex);
  setTableData(currentItems)

  return() => {}

}, [filteredData, currentPage, itemsPerPage, sort]);

const handleSort = (array, key, orderFlag) => {
  let order = "desc";
  if (orderFlag) { order = "asc"; }
  const sortedArray = array.sort((a, b) => {
    if (order === 'asc') {
        return a[key] - b[key];
    } else if (order === 'desc') {
        return b[key] - a[key];
    } else {
        throw new Error('Invalid order. Please specify "asc" for ascending or "desc" for descending.');
    }
  });
  return sortedArray
}

console.log("fitlered data", tableData)

  return (
    <div className="p-0">
      <Toaster/>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                Balance 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "balance" && sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "balance", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                Growth 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "growth" && sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "growth", order: !sort.order})}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                Win Ratio 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "win_ratio" && sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "win_ratio", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={style.headerStyle}>
                      RRR 
                      <ChevronUp 
                        className={cn(style.iconStyle, sort.key == "risk_reward_ratio_avg" && sort.order && " rotate-180")} 
                        onClick={() => setSort({key: "risk_reward_ratio_avg", order: !sort.order})}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Risk Reward Ratio (Against Average Loss)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={style.headerStyle}>
                        RRR 
                        <ChevronUp 
                          className={cn(style.iconStyle, sort.key == "risk_reward_ratio_worst" && sort.order && " rotate-180")} 
                          onClick={() => setSort({key: "risk_reward_ratio_worst", order: !sort.order})}
                        />
                      </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Risk Reward Ratio (Against Worst Loss)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                Drawdown % 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "drawdown" && sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "drawdown", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                Total Profit 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "total_profit" && sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "total_profit", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || status != "success"  ? (
            <>
              <TableRow>
                <TableCell colSpan="12">
                  <Loader/>
                </TableCell>
              </TableRow>
            </>
          ) : 
          (
            <>
              {tableData?.length > 0 ? tableData?.map((account) => (
                <AccountTableItem key={account.id} account={account} type={type}/>
              )) : 
                <TableRow>
                  <TableCell colSpan="12">
                    <p className="text-center">
                      No records found
                    </p>
                  </TableCell>
                </TableRow>
              }
            </>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan="12"  className="bg-white rounded-md">
                {type == "dashboard" && (
                  <div className="flex justify-between items-center">
                    <Select onValueChange={e => setItemsPerPage(e)}>
                      <SelectTrigger className="w-[210px]">
                        <SelectValue placeholder={`Showing ${itemsPerPage} records`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Show 10 records</SelectItem>
                        <SelectItem value="20">Show 20 records</SelectItem>
                        <SelectItem value="30">Show 30 records</SelectItem>
                        <SelectItem value="40">Show 40 records</SelectItem>
                        <SelectItem value="50">Show 50 records</SelectItem>
                        <SelectItem value="100">Show 100 records</SelectItem>
                      </SelectContent>
                    </Select>
                    <Pagination className="py-0">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious className="cursor-pointer" onClick={() => setCurrentPage(cur => cur - 1)}/>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(1)} isActive={currentPage == 1 ? true : false}>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(2)} isActive={currentPage == 2 ? true : false}>2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(3)} isActive={currentPage == 3 ? true : false}>3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages - 1 ? true : false} onClick={() => setCurrentPage(totalPages - 1)}>{totalPages - 1}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages ? true : false} onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext className="cursor-pointer" onClick={() => setCurrentPage(cur => cur + 1)} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="w-[180px]">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default AccountTable

// Merge arrays based on common id
const  mergeArrays = (arr1, arr2) => {
  // Create a map to store objects based on their ids
  const map = new Map();
  
  // Populate the map with elements from array1
  arr1.forEach(obj => map.set(obj.id, { ...map.get(obj.id), ...obj }));
  
  // Populate the map with elements from array2
  arr2.forEach(obj => map.set(obj.id, { ...map.get(obj.id), ...obj }));
  
  // Return merged values from the map
  return Array.from(map.values());
}