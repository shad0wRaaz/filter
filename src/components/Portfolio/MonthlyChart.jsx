"use client";
import { MY_API_URL } from '@/lib/utils';
import React, { useState } from 'react'
import BarChart from './Charts/BarChart';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"


const MonthlyChart = ({ accountId }) => {
  const [year, setYear] = useState("2024");
  const [allYears, setAllYears] = useState([]);
  const {data:monthlyData, status} = useQuery({
    queryKey: ["monthlychart", accountId, year],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/accounts/analysis/${accountId}/monthly`)
      .then(async res => {
        const result = await res.json(); 
        if(result.result == "success" && result?.data?.length > 0){
          
          //set years for control
          const yearSet = new Set();
          result?.data.forEach(d => {
            const year = d.date.split('-')[0];
            yearSet.add(year);
          });
          setAllYears(Array.from(yearSet).sort());

          const filteredData = result?.data?.filter(d => d.date.startsWith(year)).reverse();

          // Format dates to show month names
          const formattedLabels = filteredData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleString('default', { month: 'long' });
          });

          // backgroundColor: 'rgba(54, 162, 235, 0.6)',
          // borderColor: 'rgba(54, 162, 235, 1)',

          const data = {
            labels: formattedLabels,
            datasets: [
              {
                label: `Growth in ${year}`,
                data: filteredData?.map(d => d.growth),
                backgroundColor: function(context) {
                  const value = context.raw;
                  return value >= 0 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(255, 99, 132, 0.7)';
                },
                borderColor: function(context) {
                  const value = context.raw;
                  return value >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)';
                },
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
    <div className="relative px-6">
      <div className="absolute -top-12 right-6">
        <Select onValueChange={e => setYear(e)}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder={year} />
          </SelectTrigger>
          <SelectContent>
            {allYears.map(yr => 
              <SelectItem key={yr} value={yr}>{yr}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <BarChart chartData={monthlyData} key={year}/>
    </div>
  )
}

export default MonthlyChart
  