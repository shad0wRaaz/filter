import React from 'react'
import { Button } from '../ui/button'
import { Copy, Star } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Cross2Icon, DotsVerticalIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { useQueryClient } from '@tanstack/react-query'
import { MY_API_URL } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { useCopyTrade } from '@/contexts/CopyTradeContext'

const ContextMenu = ({account, username}) => {
  const { watchlist } = useWatchlist();
  const qc = useQueryClient();
  const {master, setMaster, setSlaves} = useCopyTrade();
    
  const updateWatchlist = async() => {

    if(!username || !account){
        toast("Watchlist not updated.");
        return
    }
    const result = await fetch(`${MY_API_URL}/watchlist`,
    {
      method: "POST",
      body: JSON.stringify({ username, watchlist: account.id })
    }).then(res => res.json());
    
    qc.invalidateQueries(['watchlist']);

    if(result.message == "Watchlist has been saved."){
      toast("Watchlist Added", { description: "The account has been added to your Watchlist."})
    }else if(result.message == "Watchlist has been deleted."){
      toast("Watchlist Deleted", { description: "The account has been taken out from your Watchlist."})
    }
  }
  const cancelCopier = () => {
    setMaster('');
    setSlaves([]);
  }

  const handleCopier = () => {
    setMaster(account);
    toast("Master Account Selected", { description: "The account has been selected to create master account."})
  }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon className="font-bold focus:border-none" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            <DropdownMenuItem 
                  className="py-1.5 cursor-pointer">
                    <Link href={`/portfolio/${account.id}`}>
                      <div className="flex mr-1">
                        <Cross2Icon className="w-4 h-4 mr-2"/> View Portfolio
                      </div>
                    </Link>
              </DropdownMenuItem>
            {master ? 
              <DropdownMenuItem 
                  className="py-1.5 cursor-pointer" 
                  onClick={() => cancelCopier()}>
                    <Cross2Icon className="w-4 h-4 mr-2"/> Cancel Copy Trade
              </DropdownMenuItem>
                :  
              <DropdownMenuItem 
                className="py-1.5 cursor-pointer" 
                onClick={() => handleCopier()}>
                  <Copy className="w-4 h-4 mr-2"/> Copy Trade
              </DropdownMenuItem >
            }
            <DropdownMenuItem
              className="py-1.5 cursor-pointer"
              onClick={() => updateWatchlist()}
            >
              <Star className="w-4 h-4 mr-2"/> Toggle from Watchlist
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ContextMenu