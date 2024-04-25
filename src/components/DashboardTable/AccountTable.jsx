import React from 'react'
import { Table, TableCell, TableBody,  TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from '../ui/skeleton'
import { Toaster, toast } from 'sonner'
import AccountTableItem from './AccountTableItem'
import { useAnalysis } from '@/contexts/AnalysisContext'
import { useFilter } from '@/contexts/FilterContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { dateDifference } from '@/lib/utils'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'


const AccountTable = ({ data, isLoading, status }) => {
  const { analysis } = useAnalysis();
  const { filter } = useFilter();
  const { leadFollower,followersOnlyArray, leadsOnlyArray} = useLeadFollower();
console.log(filter)

  const mergedData = analysis.data?.length > 0 && data?.data?.length > 0 ? mergeArrays(analysis.data, data.data) : [];
  const updatedData = mergedData.map(acc =>  ({
    ...acc,
    win_ratio: acc.total_trades != 0 && acc.total_trades_won != 0 ? Number(acc.total_trades_won / acc.total_trades * 100).toFixed(2) : 0,
    risk_reward_ratio_avg: acc.average_loss != 0 ? Number(acc.average_win / Math.abs(acc.average_loss)).toFixed(2) : 0,
    risk_reward_ratio_worst: acc.worst_trade != 0 ? Number(acc.average_win / Math.abs(acc.worst_trade)).toFixed(2) : 0,
    drawdown: (Number(acc.balance) - Number(acc.equity)) / Number(acc.balance) * 100,

  }));
// console.log(filter)

  let filteredData = updatedData;
  if(filter.accountNature == "Lead"){
    filteredData = updatedData.filter(account => leadsOnlyArray.find(lead => lead == account.id));
  }else if(filter.accountNature == "Follower"){
    filteredData = updatedData.filter(account => followersOnlyArray.find(follower => follower == account.id));
  }else if(filter.accountNature == "Standalone"){
    filteredData = updatedData.filter(account => !followersOnlyArray.find(follower => follower == account.id) && !leadsOnlyArray.find(lead => lead == account.id));
  }

  filteredData = filteredData.filter(account => 
      (String(account.client_name).toLowerCase().indexOf(filter.searchQuery) >= 0  || (String(account.id).indexOf(filter.searchQuery)) >= 0 )&&
      Number(account.growth) >= Number(filter.profitability) &&
      (String(account.trade_mode).toLowerCase() == String(filter.accountType).toLowerCase() || String(filter.accountType).toLowerCase() == "all") &&
      Number(account.win_ratio) >= filter.minWinRatio && Number(account.win_ratio < filter.maxWinRatio) &&
      Number(account.risk_reward_ratio_avg) >= Number(filter.riskRewardAverage) && 
      Number(account.risk_reward_ratio_worst) >= Number(filter.riskRewardWorst) &&
      Number(account.balance) >= Number(filter.minBalance) &&
      Number(account.drawdown <= Number(filter.maxDrawdown)) &&
      dateDifference(account.start_date) <= Number(filter.trackRecord) * 30
      );

  return (
    <div className="p-0">
      <Toaster/>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Growth</TableHead>
            <TableHead>Win Ratio</TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>RRR</span>
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
                    <span>RRR</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Risk Reward Ratio (Against Worst Loss)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>Drawdown %</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Total Profit</TableHead>
            {/* <TableHead>Followers</TableHead> */}
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || status != "success" || !analysis ? (
            <>
              <TableRow>
                {/* <TableCell><Skeleton className="h-4 w-full"/></TableCell> */}
                <TableCell><Skeleton className="h-4 w-[190px]"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
              </TableRow>
              <TableRow>
                {/* <TableCell><Skeleton className="h-4 w-full"/></TableCell> */}
                <TableCell><Skeleton className="h-4 w-[190px]"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
              </TableRow>
              <TableRow>
                {/* <TableCell><Skeleton className="h-4 w-full"/></TableCell> */}
                <TableCell><Skeleton className="h-4 w-[190px]"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
                <TableCell><Skeleton className="h-4 w-full"/></TableCell>
              </TableRow>
            </>
          ) : 
          (
            <>
              {filteredData && filteredData?.length > 0 ? filteredData?.map((account) => (
                <AccountTableItem key={account.id} account={account}/>
              )) : 
                <TableRow>
                  <TableCell colSpan="10"><p className="text-center">No records found</p></TableCell>
                </TableRow>
              }
            </>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>

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