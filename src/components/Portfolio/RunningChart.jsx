"use client";
import { MY_API_URL } from '@/lib/utils';
import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query';
import AreaChart from './Charts/AreaChart';


const RunningChart = ({ accountId }) => {
  const [type, setType] = useState("balance");
  const {data:runningChartData, status} = useQuery({
    queryKey: ["runningchart", accountId, type],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/accounts/analysis/${accountId}/daily`)
      .then(async res => {
        const result = await res.json(); 
        if(result.result == "success" && result?.data?.length > 0){
          let dataValue = [], dataLabel = "";

          if(type == "growth"){
            dataValue = result?.data?.map(data => data.running_growth);
            dataLabel = "Growth";
          }else if(type == "balance"){
            dataValue = result?.data?.map(data => data.running_balance);
            dataLabel = "Balance";
          }else{
            dataValue = result?.data?.map(data => data.running_profit_loss);
            dataLabel = "Profit/Loss";
          }

          const data = {
            // labels: Array.from({ length: result?.data?.length }, (_, i) => `${i.toString().padStart(2, '0')}`),
            labels: result.data.map(res => res.date).reverse(),
            datasets: [
                {
                    label: dataLabel,
                    data: dataValue.reverse(),
                    fill: true, // This enables filling under the line.
                    backgroundColor: 'rgba(75, 192, 192, 0.7)', // Semi-transparent color for the fill.
                    borderColor: 'rgba(75, 192, 192,0)',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                  }
            ],
          };

          return data;

      }else{
        return null;
      }
      });
    }
  });
  return (
    <div className="relative px-6">
      <div className="absolute -top-12 right-6">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ml-auto">
          <button 
            type="button"
            data-state={type == "balance" && "active"}
            onClick={() => setType("balance")}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-zinc-600 dark:text-zinc-200">
              Balance
          </button>
          <button 
            type="button"
            data-state={type == "growth" && "active"}
            onClick={() => setType("growth")}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-zinc-600 dark:text-zinc-200">
              Growth
          </button>
          <button 
            type="button"
            data-state={type == "profit" && "active"}
            onClick={() => setType("profit")}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-zinc-600 dark:text-zinc-200">
              Profit/Loss
          </button>
        </div>
      </div>
      <AreaChart chartData={runningChartData} key={type}/>
    </div>
  )
}

export default RunningChart

const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    }
    return dates;
  };