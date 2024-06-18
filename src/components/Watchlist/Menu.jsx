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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StarFilledIcon } from "@radix-ui/react-icons";

const WatchlistMenu = ({ accountId }) => {
    const [open, setOpen] = useState(false);
    const session = useSession();
    const { watchlistNames, watchlist } = useWatchlist(); //list of watchlist for the user
    const [openCreate, setOpenCreate] = useState();
    const [selectedWatchlistToDelete, setSelectedWatchlistToDelete] = useState("");
    const qc = useQueryClient();

    //this is to create new watchlist 
    const handleCreate = (e) => {
        e.preventDefault();
        const listname = e.target.watchlistname.value;
        if(listname == "" || !listname){
            toast.error("Watchlist Name not provided.");
            return;
        }
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
                        qc.invalidateQueries(['userwatchlists']);
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
    const prepareDelete = (listname) => {
        setOpen(true);
        setSelectedWatchlistToDelete(listname);
    }
    const handleDelete = async(listname) => {
        if(selectedWatchlistToDelete == "") return;

        await fetch(`${MY_API_URL}/watchlist`, {
            method: "DELETE",
            body: JSON.stringify({ 
                email: session.data.data.email,
                listname}),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => {
            const result = await res.json();
            if(result.status == 200 && result.message == "deleted"){
                toast.success("Watchlist has been deleted");
                qc.invalidateQueries(['userwatchlists']);
            }else if(result.status == 200 && result.message != "deleted"){
                toast.error("Watchlist not found.");
                qc.invalidateQueries(['userwatchlists']);
            }else{
                toast.error("Error in deleting watchlist.");    
            }
        });

        setOpen(false);
    }

  return (
    <Dialog open={open} onOpenChange={setOpen} className="!bg-black/20">
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Delete Watchlist</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete this watchlist?<br/>If confirmed all the accounts associated with this watchlist will be disassociated.
                <br/><br/><strong>This action is irreversible.</strong>
            </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <>
                        <Button 
                            type="button"
                            onClick={() => handleDelete(selectedWatchlistToDelete)}>
                                Confirm
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary"
                            onClick={() => setOpen(false)}>
                                Cancel
                        </Button>
                    </>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
        <Popover>
            <PopoverTrigger>
                {watchlist.findIndex(w => w.watchlist == accountId) > 0 ? 
                    <StarFilledIcon className="w-5 h-5 mr-2 hover:scale-150 transition cursor-pointer text-yellow-400"/>
                    :
                    <Star className="w-5 h-5 mr-2 hover:scale-150 transition cursor-pointer"/>
                }
            </PopoverTrigger>
            <PopoverContent className="text-sm max-w-[220px]">
                <div className="pb-1 font-bold">Save to Watchlist
                    {watchlistNames && watchlistNames.length !=0 && (
                        <p className="text-[12px] text-balance font-normal text-slate-400">Tick/Untick to add/remove from the Watchlist</p>
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
                        <Trash className="w-3 h-3 cursor-pointer" onClick={() => prepareDelete(w.listname)}/>
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
    </Dialog>
  )
}

export default WatchlistMenu