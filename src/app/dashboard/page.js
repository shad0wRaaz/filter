"use client"
import AccountTable from '@/components/DashboardTable/AccountTable'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import FilterSheet from '@/components/FilterSheet'
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import { useDashboardTable } from '@/contexts/DashboardTableContext'
import { useUser } from '@/contexts/UserContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { MY_API_URL } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import FilterControls from '@/components/Filters/FilterControls'

const Dashboard = ({modal}) => {
  const session = useSession();
  const { user, setUser } = useUser();
  const { initialData, setInitialData, tableData, setTableData} = useDashboardTable();
  const { watchlist, setWatchlist } = useWatchlist();
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  
  //get settings data
  const { data:settings, status:settingsStatus } = useQuery({
    queryKey: ["settings"],
    queryFn: async() => {
        return await fetch(`${MY_API_URL}/accounts/settings/get`,{
          method: "POST",
          body: JSON.stringify({username: session.data.data.email }),
          headers: {
             "Content-Type": "application/json"
          }
        })
        .then(async res => {
          const result = await res.json();
          setUser({email: session.data.data.email, secretKey: result.secretKey, apiKey: result.apiKey});
          return result;
        })
        .catch(err => { console.error(err); return err})
    },
    enabled: session.status == "authenticated"
});



  const { data:accounts, isLoading, status: accountStatus } = useQuery({
    queryKey: ['accounts'],
    queryFn: async() => {
      // if(user.secretKey == '' || user.apiKey ==  ''){ return null; }
      // return await fetch(`${MY_API_URL}/accounts/get/${limit}/${lastId}`)
      return await fetch(`${MY_API_URL}/accounts/all/0`)
      .then(res => res.json())
      .then(res => {
        setInitialData(res);
        setTableData(res);
        return res;
      })
    },
    enabled: session.status == "authenticated"
  });

  const{data:watchlistdata, status: watchliststatus} = useQuery({
    queryKey: ['watchlist'],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/watchlist/${session.data.data.email}`)
                    .then(res => {
                      if(res.ok){
                        return res.json()
                      }
                      return null;
                    })
                    .then(res => {
                      if(res){
                        setWatchlist([...res]);
                      }
                      return res;
                    })
    },
    enabled: session.status == "authenticated"
  });

  const { data:copierData, isLoading: copierLoading, status:copierStatus } = useQuery({
    queryKey: ['copiers'],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/copiers`)
                    .then(res => res.json())
    },
    enabled: session.status == "authenticated"
  });

  const {data:onlineUsers} = useQuery({
    queryKey: ['onlineUsers'],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/sessions`)
                    .then(res => res.json())
    },
    enabled: session.status == "authenticated"
  })

  return (
    <>
    {session.status != "authenticated" ? <UnauthorizedAccess/> : (
      <>
        <header>
            <Navbar onlineUsers={onlineUsers}/>
        </header>
        <main className="p-6">
          {modal}
          <FilterControls watchlistOnly={watchlistOnly} setWatchlistOnly={setWatchlistOnly} data={accounts}/>
          {/* <FilterSheet watchlistOnly={watchlistOnly} setWatchlistOnly={setWatchlistOnly} /> */}
          <Card className="mt-6 dark:bg-gray-700">
            <AccountTable 
              data={accounts} 
              isLoading={isLoading} 
              status={accountStatus} 
              type="dashboard" 
              watchlist={watchlist} 
              showWatchlist={watchlistOnly}
            />
          </Card>
        </main>
      </>
    )}
    </>
  )
}

export default Dashboard