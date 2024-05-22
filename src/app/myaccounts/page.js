"use client";
import AccountTable from '@/components/DashboardTable/AccountTable';
import FilterSheet from '@/components/FilterSheet';
import Navbar from '@/components/NavBar'
import { AddIcon } from '@/components/icons/CustomIcons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useLeadFollower } from '@/contexts/LeadFollowerContext';
import { useUser } from '@/contexts/UserContext';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { MY_API_URL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import React, { useState } from 'react'
import { Toaster } from 'sonner';

const MyAccount = ({modal}) => {
    const {user} = useUser();
    const router = useRouter();
    const {watchlist, setWatchlist} = useWatchlist();
    const [limit, setLimit] = useState(10);
    const { data, isLoading, status } = useQuery({
        queryKey: ["clientSettings"],
        queryFn: async() => {
            return await fetch(`${MY_API_URL}/accounts/client/get/${user.username}/${limit}`).then(res => {
              if(res.ok){
                return res.json()
              }
              throw res;
            })
            .catch(err => { console.log(err)})
        },
    });
    console.log(data)
    const{data:watchlistdata, status: watchliststatus} = useQuery({
      queryKey: ['watchlist'],
      queryFn: async() => {
        if(!user.username || user.username ==  ''){ return null; }
        return await fetch(`${MY_API_URL}/watchlist/${user.username}`)
                      .then(async res => {
                        if(res.ok){
                          const result = await res.json();
                          setWatchlist(result);
                          return result;
                        }
                      })
      },
    });

    const { setLeadFollower, setLeadsOnlyArray, setFollowersOnlyArray } = useLeadFollower();

  return (
    <>
      <header>
          <Navbar/>
      </header>
        {/* {modal} */}
      <main className="p-6">
        <div className="text-xl font-bold p-4 pl-0 flex justify-between flex-wrap items-center">
          My Accounts
          <Button onClick={() => router.push('/myaccounts/add')}>
              <AddIcon className="mr-1" /> Add Account
          </Button>
        </div>
        {/* <FilterSheet/> */}
        <Card className="mt-6 dark:bg-gray-700">
            <AccountTable 
              data={data?.data} 
              isLoading={isLoading} 
              status={status} 
              type="myaccounts"/>
        </Card>
      </main>
    </>
  )
}

export default MyAccount