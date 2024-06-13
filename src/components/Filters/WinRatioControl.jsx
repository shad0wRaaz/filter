"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const WinRatioControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minWinRatio, setMinWinRatio] = useState(filter ? filter.minWinRatio : 0);
    const [maxWinRatio, setMaxWinRatio] = useState(filter ? filter.maxWinRatio : 0);
    
    const handleChange = () => {
        setFilter({ ...filter, minWinRatio, maxWinRatio});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minWinRatio, maxWinRatio }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                {/* <PlusCircle className={ style.badgeIcon } /> */}
                <div className={style.filterText}>
                    <p className={style.filterLabel}>Win Ratio</p>
                    <p className={style.filterValue}> {filter.minWinRatio} - {filter.maxWinRatio}</p>
                </div>
                {/* <span>Win Ratio: {filter.minWinRatio} - {filter.maxWinRatio}%</span> */}
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Win Ratio</b>
                    <span>{minWinRatio} to {maxWinRatio}</span>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <Slider
                        defaultValue={[filter.minWinRatio, filter.maxWinRatio]}
                        min={1}
                        max={100} 
                        step={1}
                        onValueChange={
                        (e) => {
                            setMinWinRatio(Number(e[0]));
                            setMaxWinRatio(Number(e[1]));
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

export default WinRatioControl