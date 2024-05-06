"use client";
import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableCell, TableBody,  TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination"
import { Toaster, toast } from 'sonner'
import AccountTableItem from './AccountTableItem'
import { useFilter } from '@/contexts/FilterContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, dateDifference } from '@/lib/utils'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'
import Loader from '../Loader'
import { ChevronUp } from 'lucide-react'

const style = {
  headerStyle: "flex justify-between items-center cursor-pointer",
  iconStyle: "w-4 h-4 transition-all cursor-pointer duration-500"
}

const AccountTable = ({ data, isLoading, status, type, watchlist, showWatchlist }) => {

  const { filter } = useFilter();
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { leadFollower,followersOnlyArray, leadsOnlyArray} = useLeadFollower();
  const [sort, setSort] = useState({key: 'balance', order: true});
  
  useMemo(() => {
    if(!data) return

    let filteredData = data;
    //if watchlist is enabled filter it out
    if(showWatchlist){
      filteredData = filteredData.filter(acc => watchlist.some(watchaccount => watchaccount.watchlist == acc.id));
    }

    // if(filter.accountNature == "Lead"){
    //   filteredData = filteredData.filter(account => leadsOnlyArray.find(lead => lead == account.id));
    // }else if(filter.accountNature == "Follower"){
    //   filteredData = filteredData.filter(account => followersOnlyArray.find(follower => follower == account.id));
    // }else if(filter.accountNature == "Standalone"){
    //   filteredData = filteredData.filter(account => !followersOnlyArray.find(follower => follower == account.id) && !leadsOnlyArray.find(lead => lead == account.id));
    // }
    
    filteredData = filteredData?.filter(account => 
        (String(account.client_name).toLowerCase().indexOf(filter.searchQuery) >= 0  || (String(account.account_number).indexOf(filter.searchQuery)) >= 0 ) &&
        (account.copierStatus == filter.accountNature || filter.accountNature == "All") && 
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
      const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
      setTotalPages(totalPages);

    return() => {}
}, [data, filter, showWatchlist]);

useEffect(() => {
  if(!filteredData) return;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedArray = handleSort(filteredData, sort.key, sort.order);
  const currentItems = sortedArray?.slice(startIndex, endIndex);
  setTableData(currentItems)

  return() => {}

}, [filteredData, currentPage, itemsPerPage, sort, showWatchlist, filter]);

useEffect(() =>{
  if(!watchlist) return;
  setCurrentPage(1);

  return() => {}
}, [showWatchlist])

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

  const changeItemsPerPage = (count) => {
    setCurrentPage(1);
    setItemsPerPage(count);
  }


  return (
    <div className="p-0">
      <Toaster/>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-900">
            <TableHead className="rounded-tl-md">Name</TableHead>
            <TableHead>Broker</TableHead>
            <TableHead>Types</TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                <span onClick={() => setSort({key: "balance", order: !sort.order})}>Balance</span>
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "balance" && !sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "balance", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                <span onClick={() => setSort({key: "growth", order: !sort.order})} >Growth</span> 
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "growth" && !sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "growth", order: !sort.order})}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                <span onClick={() => setSort({key: "win_ratio", order: !sort.order})} >Win Ratio </span>
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "win_ratio" && !sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "win_ratio", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={style.headerStyle}>
                      <span onClick={() => setSort({key: "risk_reward_ratio_avg", order: !sort.order})}>RRR</span>
                      <ChevronUp 
                        className={cn(style.iconStyle, sort.key == "risk_reward_ratio_avg" && !sort.order && " rotate-180")} 
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
                        <span onClick={() => setSort({key: "risk_reward_ratio_worst", order: !sort.order})}>RRR</span>
                        <ChevronUp 
                          className={cn(style.iconStyle, sort.key == "risk_reward_ratio_worst" && !sort.order && " rotate-180")} 
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
                <span onClick={() => setSort({key: "drawdown", order: !sort.order})} >Drawdown % </span>
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "drawdown" && !sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "drawdown", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>
              <div className={style.headerStyle}>
                <span onClick={() => setSort({key: "total_profit", order: !sort.order})}>Total Profit</span>
                <ChevronUp 
                  className={cn(style.iconStyle, sort.key == "total_profit" && !sort.order && " rotate-180")} 
                  onClick={() => setSort({key: "total_profit", order: !sort.order})} 
                />
              </div>
            </TableHead>
            <TableHead></TableHead>
            <TableHead className="rounded-tr-md"></TableHead>
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
            <TableCell colSpan="12"  className="bg-white dark:bg-transparent rounded-md">
                {type == "dashboard" && (
                  <div className="flex justify-between items-center">
                    {/* <Select onValueChange={e => changeItemsPerPage(e)}>
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
                    </Select> */}
                    <Pagination className="py-0">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious className={`cursor-pointer ${currentPage == 1 && 'pointer-events-none cursor-not-allowed opacity-40'}`} onClick={() => setCurrentPage(cur => cur - 1)}/>
                        </PaginationItem>
                        {currentPage > 0 &&
                          <PaginationItem>
                            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(1)} isActive={currentPage == 1 ? true : false}>1</PaginationLink>
                          </PaginationItem>
                        }
                          <PaginationItem>
                            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(2)} isActive={currentPage == 2 ? true : false}>2</PaginationLink>
                          </PaginationItem>
                        {currentPage > 0 && currentPage < 4 && totalPages > 2 &&
                          <PaginationItem>
                            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(3)} isActive={currentPage == 3 ? true : false}>3</PaginationLink>
                          </PaginationItem>
                        }
                        {currentPage >= 4 && 
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        }
                        {currentPage >= 4 && currentPage <= totalPages - 2 &&
                          <PaginationItem>
                            <PaginationLink className="cursor-pointer" isActive>{currentPage}</PaginationLink>
                          </PaginationItem>
                        }
                        {currentPage < totalPages - 2 && totalPages > 4 &&
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        }
                        {totalPages > 4 && 
                          <>
                            <PaginationItem>
                              <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages - 1 ? true : false} onClick={() => setCurrentPage(totalPages - 1)}>{totalPages - 1}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages ? true : false} onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                            </PaginationItem>
                          </>
                        }
                        <PaginationItem>
                          <PaginationNext className={`cursor-pointer ${currentPage == totalPages && 'pointer-events-none cursor-not-allowed opacity-40'}`} onClick={() => setCurrentPage(cur => cur + 1)} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
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