"use client"
import AccountTable from '@/components/DashboardTable/AccountTable'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import FilterSheet from '@/components/FilterSheet'
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import { useDashboardTable } from '@/contexts/DashboardTableContext'
import { useMySession } from '@/contexts/SessionContext'
import { useUser } from '@/contexts/UserContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { MY_API_URL } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

import React, { useState } from 'react'

const Dashboard = ({modal}) => {
  const {session} = useMySession();
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
          body: JSON.stringify({username: user.username }),
          headers: {
             "Content-Type": "application/json"
          }
        }).then(res => {
          if(res.ok){
            return res.json()
          }
          throw res;
        })
        .then(res => {
          setUser({...user, secretKey: res.secretKey, apiKey: res.apiKey});
          return res;
        })
        .catch(err => { console.log(err)})
    },
    enabled: session.email != ""
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
    enabled: session.email != ""
  });

  const{data:watchlistdata, status: watchliststatus} = useQuery({
    queryKey: ['watchlist'],
    queryFn: async() => {
      if(!user.username || user.username ==  ''){ return null; }
      return await fetch(`${MY_API_URL}/watchlist/${user.username}`)
                    .then(res => res.json())
                    .then(res => {
                      setWatchlist([...res]);
                      return res;
                    })
    },
    enabled: session.email != ""
  });

  const { data:copierData, isLoading: copierLoading, status:copierStatus } = useQuery({
    queryKey: ['copiers'],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/copiers`)
                    .then(res => res.json())
    },
    enabled: session.email != ""
  })

  return (
    <>
    {session.email == "" ? <UnauthorizedAccess/> : (
      <>
        <header>
            <Navbar/>
        </header>
        <main className="p-6">
          {modal}
          <FilterSheet watchlistOnly={watchlistOnly} setWatchlistOnly={setWatchlistOnly} />
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