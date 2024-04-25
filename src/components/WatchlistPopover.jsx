
"use client";
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { useWatchlist } from '@/contexts/WatchlistContext';
import WatchlistPopoverItem from './WatchlistPopoverItem';
import { Separator } from '@radix-ui/react-separator';
import { Button } from './ui/button';

const WatchlistPopover = () => {
    const [open, setOpen] = useState(false);
    const { watchlist } = useWatchlist();
  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
        <PopoverTrigger>
            {open 
                ? <StarFilledIcon className="h-[1.2rem] w-[1.2rem] rotate-0 text-white scale-100 transition-all"/>
                : <StarIcon  className="h-[1.2rem] w-[1.2rem] rotate-0 text-white scale-100 transition-all"/>
            }
        </PopoverTrigger>
        <PopoverContent className="dark:bg-slate-800 shadow-lg">
            <p className="pb-1 mb-2 border-b border-b-slate-200">Watchlist</p>
            <Separator />
            {watchlist && watchlist.map((account, index) => 
                <WatchlistPopoverItem account={account} key={account.watchlist  } index={index}/>
                )}
            <div className="p-2 flex justify-center"><Button variant="ghost" className="text-sm">View All</Button></div>
        </PopoverContent>
    </Popover>
  )
}

export default WatchlistPopover