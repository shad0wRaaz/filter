"use client";
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import { useAccounts } from '@/contexts/AccountsContext';
import { useUser } from '@/contexts/UserContext'
import { useWatchlist } from '@/contexts/WatchlistContext';
import React from 'react'

const Watchlist = () => {
  const {user} = useUser();
  const { watchlist } = useWatchlist();
  const {allAccounts } = useAccounts();

  return (
    <>
      <header>
          <Navbar/>
      </header>
      <main className="p-6">
        <Card className="mt-6 dark:bg-gray-700">
          Watchlist
        </Card>
      </main>
    </>
  )
}

export default Watchlist