import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import Watchlist from '../Watchlist'
import { useUser } from '@/contexts/UserContext'
import { Badge } from '../ui/badge'
import { useAnalysis } from '@/contexts/AnalysisContext'
import { Button } from '../ui/button'
import { currencyFormat, timeAgo } from '@/lib/utils'
import ContextMenu from './ContextMenu'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { StarFilledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useCopyTrade } from '@/contexts/CopyTradeContext'
import { CheckIcon, CrossIcon } from '../icons/CustomIcons'
import { toast } from 'sonner'
import CopierDialog from '../CopierSettings/CopierDialog'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'

const AccountTableItem = ({ account }) => {

    const { user } = useUser();
    const { analysis } = useAnalysis();
    const { watchlist } = useWatchlist();
    const myAnalysis = analysis?.data?.find(item => item.id == account.id);
    const isWatchlist = watchlist?.find(user => user.watchlist == account.id);
    const { master, slaves, setSlaves } = useCopyTrade();
    const { leadsOnlyArray, followersOnlyArray } = useLeadFollower();

    if(!myAnalysis) { return }

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

  return (
    <TableRow 
      key={account.id} 
      className={
        account.id == master.id ? 
        " bg-slate-200 hover:bg-slate-200 dark:bg-slate-800" 
        : ""
        }>
        <TableCell>
            {/* <Portfolio account={account} isWatchlist={isWatchlist} type="link"/> */}
            <Link href={`/portfolio/${account.id}`}>
              <div className="font-medium flex items-center gap-1">
                {account.client_name} {isWatchlist && <StarFilledIcon color="#f9a825" className="transition-all hover:rotate-90 duration-500" />}
              </div>
            </Link>
        </TableCell>
        <TableCell>
        <div className="flex gap-2 items-center justify-start">
          {account.trade_mode == "demo" &&
            <Badge variant="secondary" className="rounded-[5px] border border-slate-200 dark:bg-slate-600 dark:border-slate-700 shadow-sm">
              {account.trade_mode == "demo" && "Demo"}
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
        <TableCell>{ currencyFormat(account.balance)}</TableCell>
        <TableCell>{Number(account.growth).toFixed(2)}%</TableCell>
        <TableCell>{account.win_ratio}</TableCell>
        <TableCell>{account.risk_reward_ratio_avg}</TableCell>
        <TableCell>{account.risk_reward_ratio_worst}</TableCell>
        <TableCell>{Number(account.drawdown).toFixed(2)}%</TableCell>
        <TableCell>{ new Date(account.start_date).toLocaleString()}</TableCell>
        <TableCell>{ currencyFormat(account.total_profit)}</TableCell>
        {/* <TableCell>0</TableCell> */}
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
    </TableRow>
  )
}

export default AccountTableItem