"use client";
import { MY_API_URL } from '@/lib/utils';
import React, { useState } from 'react'
import BarChart from './Charts/BarChart';
import { useQuery } from '@tanstack/react-query';


const DailyChart = ({ accountId }) => {
  const [type, setType] = useState("win");
  const {data:dailyData, status} = useQuery({
    queryKey: ["dailychart", accountId, type],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/accounts/analysis/${accountId}/day`)
      .then(async res => {
        const result = await res.json(); 
        if(result.result == "success" && result?.data?.length > 0){
          let data1 = [], data2 = [], data1Label = "", data2Label = "";

          if(type == "win"){
            data1 = result?.data?.map(data => data.win);
            data2 = result?.data?.map(data => data.loss);
            data1Label = "Wins";
            data2Label = "Losses"
          }else{
            data1 = result?.data?.map(data => data.buy);
            data2 = result?.data?.map(data => data.sell);
            data1Label = "Buys";
            data2Label = "Sells"
          }

          const data = {
            labels: getLast7Days(),
            datasets: [
              {
                label: data1Label,
                data: data1,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5,
              },
              {
                label: data2Label,
                data: data2,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 5,
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
    <div className="relative">
      <div className="absolute -top-12 right-0">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ml-auto">
          <button 
            type="button"
            data-state={type != "win" && "active"}
            onClick={() => setType("buy")}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-zinc-600 dark:text-zinc-200">
              Buys & Sells
          </button>
          <button 
            type="button"
            data-state={type == "win" && "active"}
            onClick={() => setType("win")}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-zinc-600 dark:text-zinc-200">
              Wins & Losses
          </button>
        </div>
      </div>
      <BarChart chartData={dailyData} key={type}/>
    </div>
  )
}

export default DailyChart

const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    }
    return dates;
  };