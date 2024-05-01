"use client";
import AddAccountComponent from '@/components/Account/Add';
import Navbar from '@/components/NavBar'
import { Card } from '@/components/ui/card'
import React from 'react'

const AddAccount = () => {
  return (
    <>
      <header>
          <Navbar/>
      </header>
      <main className="p-6">
        <Card className="mt-6 dark:bg-gray-700">
          <AddAccountComponent/>
        </Card>
      </main>
    </>
  )
}

export default AddAccount