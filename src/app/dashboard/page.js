"use client"
import AccountTable from '@/components/DashboardTable/AccountTable'
import FilterSheet from '@/components/FilterSheet'
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import { useAccounts } from '@/contexts/AccountsContext'
import { useAnalysis } from '@/contexts/AnalysisContext'
import { useLeadFollower } from '@/contexts/LeadFollowerContext'
import { useUser } from '@/contexts/UserContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { MY_API_URL } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

const Dashboard = ({modal}) => {
  const { user, setUser } = useUser();
  const { allAccounts, setAllAccounts } = useAccounts();
  const { setWatchlist } = useWatchlist();
  const { analysis, setAnalysis } = useAnalysis();
  const { setLeadFollower, setLeadsOnlyArray, setFollowersOnlyArray } = useLeadFollower();
  //get settings data
  const { data:settings, status } = useQuery({
    queryKey: ["settings"],
    queryFn: async() => {
        return await fetch(`${MY_API_URL}/settings?u=${user.username}`)
            .then(res => res.json())
            .catch(err => console.log(err))
    },
    enabled: user.username != '' && user.secretKey == '' && user.apiKey == ''
});

  const { data:accounts, isLoading, status: accountStatus } = useQuery({
    queryKey: ['accounts'],
    queryFn: async() => {
      if(user.secretKey == '' || user.apiKey ==  ''){ return null; }
      return await fetch(`${MY_API_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify({ 
          ak: user.apiKey,
          sk: user.secretKey,
          type: "fetch"
        })
      }).then(res => res.json())
    },
    enabled: user.secretKey != '' && user.apiKey != ''
  });
console.log(accounts)
  const{data:watchlistdata, status: watchliststatus} = useQuery({
    queryKey: ['watchlist'],
    queryFn: async() => {
      if(!user.username || user.username ==  ''){ return null; }
      return await fetch(`${MY_API_URL}/watchlist?u=${user.username}`)
                    .then(res => res.json())
    },
    enabled: user.username != ''
  });

  const { data:copierData, isLoading: copierLoading, status:copierStatus } = useQuery({
    queryKey: ['copiers'],
    queryFn: async() => {
      if(user.apiKey == '' || user.secretKey == '') { return null; }
      return await fetch(`${MY_API_URL}/copyer`, {
        method: "POST",
        body: JSON.stringify({
          type: "fetch",
          ak: user.apiKey,
          sk: user.secretKey,
        })
      }).then(res => res.json())
    },
    enabled: user.secretKey != '' && user.apiKey != ''
  })

  const { data: analysisData, isLoading: analysisLoading, status: analysisStatus } = useQuery({
    queryKey: ['analysis'],
    queryFn: async() => {
      if(user.secretKey == '' || user.apiKey ==  ''){ return null; }
      return await fetch(`${MY_API_URL}/analyses`, {
        method: "POST",
        body: JSON.stringify({
          type: "all",
          ak: user.apiKey,
          sk: user.secretKey,
          ai: 940935
        })
      })
        .then(res => res.json());
    },
    enabled: user.secretKey != '' && user.apiKey != ''
  });

  useEffect(() => {
    if(!analysisData) return
    console.log(analysisData)
      setAnalysis(analysisData);
      
    return () => {
      // clean up function
    }
  }, [analysisData]);

  useEffect(() => {
    if(!accounts) return
    //add first trade using monthly symbol//adding that key also
    const newaccounts = accounts?.data.map(async acc => {
      const ms = await fetch(`${MY_API_URL}/trades`, {  
        method: "POST",
        body: JSON.stringify({
          ak: user.apiKey,
          sk: user.secretKey,
          ai: acc.id,
          type: "fetch",
          limit: 2,
        })
      }).then(res => res.json());
      return ms;
    });
    ;(async() => {
      const as = await Promise.all(newaccounts);
      const updatedAccounts = accounts.data.map((acc,index) => ( {...acc, start_date: as[index].data[0].open_time}))
      setAllAccounts({...accounts, data: updatedAccounts});
    })()
      
    return () => {
      // clean up function
    }
  }, [accounts]);

  useEffect(() => {
    if(!settings) return
      setUser({ ...user, secretKey: settings.secretKey, apiKey: settings.apiKey})
      
    return () => {
      // clean up function
    }
  }, [settings]);

  useEffect(() => {
    if(!watchlistdata) return
    setWatchlist([ ...watchlistdata ])
      
    return () => {
      // clean up function
    }
  }, [watchlistdata]);
  useEffect(() => {
    if(!copierData) return
    setLeadFollower(copierData);
    let leadsOnly = [], followersOnly = [];

    if(copierData.data.length > 0){
      leadsOnly =  copierData.data.map(acc => acc.lead_id);
      leadsOnly = new Set(leadsOnly);
      var leadArray = Array.from(leadsOnly);
      
      followersOnly = copierData.data.map(acc => acc.follower_id);
      setLeadsOnlyArray(leadArray);
      setFollowersOnlyArray(followersOnly);
    }
      
    return () => {
      // clean up function
    }
  }, [copierData]);
  
  // const { data:monthlysymbol, isLoading:tradesLoading, status: tradeStatus } = useQuery({
  //   queryKey: ['monthlysymbol'],
  //   queryFn: async() => {
  //     // if(user.secretKey == '' || user.apiKey ==  '' || Boolean(accountId)){ return null; }
  //     return await fetch(`${MY_API_URL}/analyses`, {
  //       method: "POST",
  //       body: JSON.stringify({ 
  //         ak: user.apiKey,
  //         sk: user.secretKey,
  //         ai: 940935,
  //         type: "monthly"
  //       })
  //     }).then(res => res.json());
  //   },
  //   enabled: user.secretKey != '' && user.apiKey != '' 
  // });
  // console.log(monthlysymbol)

  return (
    <>
      <header>
          <Navbar/>
      </header>
      <main className="p-6">
        {modal}
        <FilterSheet/>
        <Card className="mt-6 dark:bg-gray-700">
          <AccountTable data={allAccounts} isLoading={isLoading} status={accountStatus}/>
        </Card>
      </main>
    </>
  )
}

export default Dashboard