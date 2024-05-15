"use client";
import { MY_API_URL } from '@/lib/utils';
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import DoughnutChart from './Charts/PolarChart';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AssetDistribution = ({ accountId }) => {
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("4");
  const [allYears, setAllYears] = useState([]);
  const [allMonths, setAllMonths] = useState([]);
  const {data:assetData, status} = useQuery({
    queryKey: ["assetData", accountId, year],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/accounts/analysis/${accountId}/monthlysymbol`)
      .then(async res => {
        let returnObject = "";
        const result = await res.json();
        if(result.result == "success" && result?.data?.length > 0){
          returnObject = result?.data;

          //get unique years and months for select control
          const uniqueYears = new Set();
          const uniqueMonths = new Set();
          result?.data.forEach(item => {
            const date = new Date(item.date);
            uniqueYears.add(date.getFullYear());
            uniqueMonths.add(date.getMonth() + 1);
          });
          setAllYears(Array.from(uniqueYears));
          setAllMonths(Array.from(uniqueMonths));
        }
        else{
          returnObject = [];
        }
        return returnObject;
      });
    }
  });
  return (
    <div className="relative w-100% h-[350px]">
      <div className="absolute -top-12 right-6">
        <div className="flex gap-2">
          <Select onValueChange={e => setYear(e)}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder={year} />
            </SelectTrigger>
            <SelectContent>
              {allYears?.map(yr => 
                <SelectItem key={yr} value={yr}>{yr}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select onValueChange={e => setMonth(e)}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder={monthNames[month - 1]} />
            </SelectTrigger>
            <SelectContent>
              {allMonths?.map(mth => 
                <SelectItem key={mth} value={mth}>{monthNames[mth - 1]}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DoughnutChart chartData={assetData} key={year} year={year} month={month}/>
    </div>
  )
}

export default AssetDistribution

