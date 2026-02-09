"use client"
import AccountTable from '@/components/DashboardTable/AccountTable'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
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
import { encryptData } from '@/lib/encryption'
import { Button } from '@/components/ui/button'

const Dashboard = ({modal}) => {
  const session = useSession();
  const { user, setUser } = useUser();
  const { initialData, setInitialData, tableData, setTableData} = useDashboardTable();
  const { watchlist, setWatchlist, setWatchlistNames } = useWatchlist();
  const [selectedWatchlist, setSelectedWatchlist] = useState("all");
  const [alldata, setAllData] = useState();
  // console.log(encryptData("8AWoPdnPVlFIQ4zs"));
  // console.log(encryptData("5ut5UzcVKgHm"));
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


  const {data:watchlistitems} = useQuery({
    queryKey: ['userwatchlists'],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/watchlistname/${session.data.data.email}`)
                    .then(res => {
                      if(res.ok){
                        return res.json();
                      }
                      return null;
                    })
                    .then(res => {
                      if(res){
                        setWatchlistNames([...res]);
                      }
                      return res;
                    })
    }
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
  });
// Helper function to handle undefined or null values
  function replacer(key, value) {
    return value === null || value === undefined ? '' : value;
  }
  
//this query is used for csv export
  const { data:accountsandTrades = [], isFetching, status } = useQuery({
    queryKey: ['accountsAndTradesData'],
    queryFn: async () => {
      return await fetch(`${MY_API_URL}/accounts/getacountandtrades`)
      .then(async res => {
        const result = await res.json();
        setAllData(result);
        return result
      });
    },
    enabled: false
  })

  const { data:findDayTrader = [], isFetching:fetchingDayTrader, status:dayTraderSTatus } = useQuery({
    queryKey: ['dayTraderData'],
    queryFn: async () => {
      return await fetch(`${MY_API_URL}/accounts/getdaytraders`)
      .then(async res => {
        const result = await res.json();

        return result
      });
    },
    enabled: true
  })

  const handleExport = async() => {

    if(!alldata) return;
    //take out followers
    const accountsandTrades = alldata.filter(acc => acc.copierStatus != "Follower");

    // Get the keys (column headers) from the first object
    const headers = Object.keys(accountsandTrades[0]);

    // Convert array of objects into a CSV string
    const csvContent = [
        headers.join(','), // Create header row
        ...accountsandTrades.map(obj => headers.map(header => JSON.stringify(obj[header], replacer)).join(',')) // Map each object
    ].join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create an anchor element and trigger a download
    const link = document.createElement('a');
    if (link.download !== undefined) { // Check if download attribute is supported
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', "export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove the link after download
    }
  }
  return (
    <>
    {session.status != "authenticated" ? <UnauthorizedAccess/> : (
      <>
        <header>
            <Navbar onlineUsers={onlineUsers}/>
        </header>
        <main className="p-6">
          {modal}
          <FilterControls selectedWatchlist={selectedWatchlist} setSelectedWatchlist={setSelectedWatchlist} data={accounts}/>
          <Button onClick={() => handleExport()}>Export CSV</Button>
          <Card className="mt-6 dark:bg-gray-700">
            <AccountTable 
              data={accounts} 
              isLoading={isLoading} 
              status={accountStatus} 
              type="dashboard" 
              watchlist={watchlist} 
              selectedWatchlist={selectedWatchlist}
            />
          </Card>
        </main>
      </>
    )}
    </>
  )
}

export default Dashboard