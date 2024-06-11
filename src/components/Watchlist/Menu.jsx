"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Check, Plus, Star, Trash } from 'lucide-react'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { MY_API_URL } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

const WatchlistMenu = ({ accountId }) => {
    const session = useSession();
    const { watchlistNames, watchlist } = useWatchlist(); //list of watchlist for the user
    const [openCreate, setOpenCreate] = useState();
    const qc = useQueryClient();

    //this is to create new watchlist 
    const handleCreate = (e) => {
        e.preventDefault();
        const listname = e.target.watchlistname.value;
        if(listname == "" || !listname){
            toast.error("Watchlist Name not provided.");
            return;
        }
        console.log(session.data.data.email, listname)
        if(session?.data?.data?.email){
            ;(async() => {
                const savewatchlist = await fetch(`${MY_API_URL}/watchlistname`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: session.data.data.email,
                        watchlistname: listname,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(async res => {
                    const result = await res.json();
                    if(result.status == 200){
                        toast.success(result.message);
                        e.target.watchlistname.value = "";
                        qc.invalidateQueries(['userwatchlists'])
                    }
                })
            })()
        }

    }
    //this is to add/remove accounts to a watchlist
    const updateWatchlist = async(listname) => {
        
        const result = await fetch(`${MY_API_URL}/watchlist`,
        {
          method: "POST",
          body: JSON.stringify({ 
            email: session.data.data.email, 
            watchlist: accountId, 
            listname }),
          headers: {
            'Content-Type' : 'application/json',
          }
        }).then(res => res.json());
        
        
        if(result.status == 200 && result.message == "saved"){
            toast.success(result.description)
        }else if(result.status == 200 && result.message =="deleted"){
            toast.success(result.description)
        }else{
            toast.error(result.description)
        }
        qc.invalidateQueries(['watchlist']);
      }
    // console.log()
  return (
    <Popover>
        <PopoverTrigger>
            <Star className="w-5 h-5 mr-2 hover:scale-150 transition cursor-pointer"/>
        </PopoverTrigger>
        <PopoverContent className="text-sm max-w-[220px]">
            <div className="pb-1 font-bold">Save to Watchlist
                {watchlistNames && watchlistNames.length !=0 && (
                    <p className="text-[11px] text-slate-400">Tick/Untick to add/remove from the Watchlist</p>
                )}
            </div>
            <hr/>
        {watchlistNames && watchlistNames.map(w => (
                <div 
                key={w._id} 
                className="flex items-center justify-between py-2">
                    <div className="flex gap-2 items-center">
                        <Checkbox
                            checked={watchlist.find(item => item.email == session.data.data.email && item.watchlist == accountId && item.listname == w.listname) ? true : false}
                            className="rounded-[5px]"
                            onClick={() => updateWatchlist(w.listname)}/>
                            {w.listname}
                    </div>
                    <Trash className="w-3 h-3 cursor-pointer" />
                </div>
            ))}
            {watchlistNames && watchlistNames.length == 0 && (
                <p className="py-2 text-[13px] text-slate-400 dark:text-slate-500">No watchlist created yet.</p>
            )}
            <hr/>
            <div 
                className="flex items-center justify-start pt-3 cursor-pointer mb-2"
                onClick={() => setOpenCreate(prev => !prev)}>
                <Plus className="w-4 h-4 mr-1"/> Create New Watchlist
            </div>
            <form onSubmit={handleCreate}>
                <div className={`flex gap-1 ${openCreate ? ' block': ' hidden'}`}>
                    <Input placeholder="Watchlist name" name="watchlistname" className="text-[13px]"/>
                    <Button 
                        variant="secondary"
                        type="submit">
                            <Check className="w-4 h-4 p-0" />
                    </Button>
                </div>
            </form>
        </PopoverContent>
    </Popover>
  )
}

export default WatchlistMenu