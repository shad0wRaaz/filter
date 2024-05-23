import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const UnauthorizedAccess = () => {
    const router = useRouter();
  return (
    <div className="h-full w-full flex justify-center items-center">
        <div className="mt-[200px] flex justify-center flex-col">
            <h2 className="mb-3 text-2xl font-bold">Access Denied</h2>
            <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
    </div>
  )
}

export default UnauthorizedAccess