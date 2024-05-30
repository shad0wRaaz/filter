"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const RiskRewardRatioAverageLoss = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minRiskRewardAverage, setMinRiskRewardAverage] = useState(filter ? filter.minRiskRewardAverage : 0);
    const [maxRiskRewardAverage, setMaxRiskRewardAverage] = useState(filter ? filter.maxRiskRewardAverage : 0);

    const handleChange = () => {
        setFilter({ ...filter, minRiskRewardAverage, maxRiskRewardAverage});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minRiskRewardAverage, maxRiskRewardAverage }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                {/* <PlusCircle className={ style.badgeIcon } /> */}
                <div className={style.filterText}>
                  <p className={style.filterLabel}>RRR (Avg. Loss)</p>
                  <p className={style.filterValue}>{filter.minRiskRewardAverage} - {filter.maxRiskRewardAverage}</p>
                </div>
                {/* <span>RRR (Avg. Loss): {filter.minRiskRewardAverage} - {filter.maxRiskRewardAverage}</span> */}
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Risk Reward Ratio (Average Loss)</b>
                    <span>{minRiskRewardAverage} to {maxRiskRewardAverage}</span>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <Slider
                        defaultValue={[filter.minRiskRewardAverage, filter.maxRiskRewardAverage]}
                        min={1}
                        max={10} 
                        step={1}
                        onValueChange={
                        (e) => {
                            setMinRiskRewardAverage(Number(e[0]));
                            setMaxRiskRewardAverage(Number(e[1]));
                            }}
                        />
                    <Button onClick={() => handleChange()}>
                        <Check width={15}/>
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default RiskRewardRatioAverageLoss