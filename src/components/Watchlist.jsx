import { useWatchlist } from '@/contexts/WatchlistContext';
import { MY_API_URL } from '@/lib/utils';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { QueryClient } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';

const style = {
    star: "transition-all hover:rotate-90 duration-500" 
}
const Watchlist = ({username, id}) => {
    const { watchlist } = useWatchlist();
    const qc = new QueryClient();

    const updateWatchlist = async() => {

        if(!username){
            toast("Watchlist not updated.");
            return
        }
        const result = await fetch(`${MY_API_URL}/watchlist`,
        {
          method: "POST",
          body: JSON.stringify({ username, watchlist: id })
        }).then(res => res.json());
        
        qc.invalidateQueries(['Watchlist']);

        if(result.message == "Watchlist has been saved."){
          toast("Watchlist Added", { description: "The account has been added to your Watchlist."})
        }else if(result.message == "Watchlist has been deleted."){
          toast("Watchlist Deleted", { description: "The account has been taken out from your Watchlist."})
        }
      }

  return (
    <div 
        className="rounded-sm border w-7 h-7 flex items-center justify-center cursor-pointer"
        onClick={() => updateWatchlist()}>
            {watchlist?.find(account => account.watchlist == Number(id))
            ? <StarFilledIcon color="#f9a825" className={ style.star} />
            : <StarIcon className={style.star} />
            }
    </div>
  )
}

export default Watchlist

