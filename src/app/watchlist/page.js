"use client";
import AccountTable from '@/components/DashboardTable/AccountTable';
import FilterSheet from '@/components/FilterSheet';
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import { useAccounts } from '@/contexts/AccountsContext';
import { useUser } from '@/contexts/UserContext'
import { useWatchlist } from '@/contexts/WatchlistContext';
import { MY_API_URL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const Watchlist = ({modal}) => {
  const {user} = useUser();
  const { watchlist, setWatchlist } = useWatchlist();
  const {accounts } = useAccounts();
  

  const{data:watchlistdata, isLoading, status} = useQuery({
    queryKey: ['watchlist'],
    queryFn: async() => {
      if(!user.username || user.username ==  ''){ return null; }
      return await fetch(`${MY_API_URL}/watchlist/${user.username}`)
                    .then(res => res.json())
                    .then(res => {
                      console.log(res)
                      setWatchlist([...res]);
                      return res;
                    })
    },

  });

  return (
    <>
      <header>
          <Navbar/>
      </header>
      <main className="p-6">
        {modal}
        <FilterSheet/>
        <Card className="mt-6 dark:bg-gray-700">
          <AccountTable data={watchlistdata} isLoading={isLoading} status={status} type="watchlist"/>
        </Card>
      </main>
    </>
  )
}

export default Watchlist