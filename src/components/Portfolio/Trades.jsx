"use client";
import { MY_API_URL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';   
import React, { useState } from 'react'
import Loader from '../Loader';
import TradeTable from './TradeTable';

const Trades = ({id}) => {

    const {data, isLoading, status} = useQuery({
        queryKey: ["trades", id],
        queryFn: async() => 
           { return await fetch(`${MY_API_URL}/accounts/trades/${id}`).then(res => res.json())
            },
        },
    );

  return (
    <>
        {isLoading  ? 
            <div className="flex w-[100%] h-[100%] items-center justify-center pt-2">
                <Loader/>
            </div> 
            : (
                <>
                    {status == "success" && data?.data?.length > 0 ? (
                        <div className="flex justify-center text-sm font-normal">
                            <TradeTable data={data.data}/>
                        </div>
                    ) : <div className="flex justify-center text-sm font-bold">No trades found</div>}
                </>
        )}
    </>
  )
}

export default Trades
