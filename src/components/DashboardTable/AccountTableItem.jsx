import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import Watchlist from '../Watchlist'
import { useUser } from '@/contexts/UserContext'
import { Badge } from '../ui/badge'
import { useAnalysis } from '@/contexts/AnalysisContext'
import { Button } from '../ui/button'
import { MY_API_URL, currencyFormat, timeAgo } from '@/lib/utils'
import ContextMenu from './ContextMenu'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { StarFilledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useCopyTrade } from '@/contexts/CopyTradeContext'
import { CheckIcon, CrossIcon } from '../icons/CustomIcons'
import { toast } from 'sonner'
import CopierDialog from '../CopierSettings/CopierDialog'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'
import { Star } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useQueryClient } from '@tanstack/react-query'

const AccountTableItem = ({ account, type }) => {

    const { user } = useUser();
    const { watchlist } = useWatchlist();
    const isWatchlist = watchlist.length > 0 ?  watchlist?.find(user => user.watchlist == account.id) : null;
    const { master, slaves, setSlaves } = useCopyTrade();
    const { leadsOnlyArray, followersOnlyArray } = useLeadFollower();
    const qc = useQueryClient();


    const handleAddtoCopier = () => {
      if(slaves.length > 0){
        const ind = slaves.find(slaveAcc => slaveAcc.id == account.id);
        if(!ind){
          setSlaves([...slaves, { ...account }])
        }
      }else{
        setSlaves([...slaves, { ...account }]);
      }
      toast("Account Added", { description: `${account.client_name} has been added to the copier list.`})
    }
    
    const handleRemoveFromCopier = () => {
      if(slaves.length > 0){
        const removedSlaves = slaves.filter(acc => acc.id != account.id);
        setSlaves([...removedSlaves]);
        toast("Account Removed", { description: `${account.client_name} has been deleted from the copier list.`})
      }
    }

    const updateWatchlist = async() => {
      if(!user.username || !account){
          toast("Watchlist not updated.");
          return
      }
      const result = await fetch(`${MY_API_URL}/watchlist`,
      {
        method: "POST",
        body: JSON.stringify({ username: user.username, watchlist: account.id }),
        headers: {
          'Content-Type' : 'application/json',
        }
      }).then(res => res.json());
      
      
      if(result.message == "Watchlist has been saved."){
        toast("Watchlist Added", { description: "The account has been added to your Watchlist."})
      }else if(result.message == "Watchlist has been deleted."){
        toast("Watchlist Deleted", { description: "The account has been taken out from your Watchlist."})
      }
      qc.invalidateQueries(['watchlist']);
    }

  return (
    <TableRow 
      className={
        account.id == master.id ? 
        " bg-slate-200 hover:bg-slate-200 dark:bg-slate-800" 
        : ""
        }>
        <TableCell>
            {/* <Portfolio account={account} isWatchlist={isWatchlist} type="link"/> */}
            <Link href={`/portfolio/${account.id}`}>
              <div className="font-medium flex items-center gap-1">
                {account.client_name ? account.client_name : account.account_number}
              </div>
            </Link>
        </TableCell>
        <TableCell>
        <div className="flex gap-2 items-center justify-start">
          {account.trade_mode == "demo" &&
            <Badge variant="secondary" className="rounded-[5px] border border-slate-200 dark:bg-slate-600 dark:border-slate-700 shadow-sm">
              Demo
            </Badge>}
          {account.trade_mode == "real" &&
            <Badge variant="secondary" className="rounded-[5px] border border-green-300 bg-green-200 dark:bg-green-600 dark:border-green-700 shadow-sm">
              Real
            </Badge>}
          <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">
            MT{account.mt_version}
          </Badge>
          {leadsOnlyArray.length > 0 && leadsOnlyArray.find(acc => acc == account.id) && (
            <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">
              Lead
            </Badge>
          )}
          {followersOnlyArray.find(acc => acc == account.id) && (
            <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">
              Follower
            </Badge>
          )}
        </div>
        </TableCell>
        <TableCell>{ currencyFormat(account.balance, account.currency)}</TableCell>
        <TableCell>{Number(account.growth).toFixed(2)}%</TableCell>
        <TableCell>{account.win_ratio}</TableCell>
        <TableCell>{account.risk_reward_ratio_avg}</TableCell>
        <TableCell>{account.risk_reward_ratio_worst}</TableCell>
        <TableCell>{Number(account.drawdown).toFixed(2)}%</TableCell>
        <TableCell>{ new Date(account.start_date).toLocaleString()}</TableCell>
        <TableCell>{ currencyFormat(account.total_profit, account.currency)}</TableCell>
        {/* <TableCell>0</TableCell> */}
        {type == "watchlist" ? (
          <>
            <TableCell>
              <div className="flex gap-2 items-center justify-start">
                {master && master.id != account.id ?
                  <>
                    {slaves.find(acc => acc.id == account.id) 
                    ?
                    <div className="flex gap-2">
                      <Badge 
                        variant="secondary" 
                        className="rounded-[5px] text-center border shadow-sm bg-green-500 border-green-500 hover:bg-green-600 cursor-pointer text-white dark:bg-slate-600 dark:border-slate-700">
                          <CheckIcon/> Added
                      </Badge>
                      <div 
                        className="shadow-sm rounded-[5px] w-6 text-white bg-red-400 hover:bg-red-500 flex justify-center items-center cursor-pointer"
                        onClick={() => handleRemoveFromCopier()}>
                        <CrossIcon/>
                      </div>
                    </div>
                  : 
                    <Badge 
                      variant="secondary" 
                      className="rounded-[5px] text-center border shadow-sm bg-green-500 border-green-500 hover:bg-green-600 cursor-pointer text-white dark:bg-slate-600 dark:border-slate-700"
                      onClick={() => handleAddtoCopier()}>
                      Add to Copier
                    </Badge>
                  }
                  </>
                :
                master && master.id == account.id &&
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="rounded-[5px] border text-center shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">
                      Lead
                    </Badge>
                    {slaves.length > 0 &&
                      <CopierDialog type="Create" />
                    }
                  </div>
                }
              </div>
            </TableCell>
            <TableCell>
              <ContextMenu account={account} username={user.username}/>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isWatchlist ?
                      <StarFilledIcon 
                        color="#f9a825" 
                        className="w-5 h-5 transition cursor-pointer hover:scale-150 duration-500"
                        onClick={() => updateWatchlist()}/>
                    :
                      <Star 
                      className="w-5 h-5 mr-2 hover:scale-150 transition cursor-pointer"
                      onClick={() => updateWatchlist()}/>
                    }
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell></TableCell>
          </>
        )}
    </TableRow>
  )
}

export default AccountTableItem