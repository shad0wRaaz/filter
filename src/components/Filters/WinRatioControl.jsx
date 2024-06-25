"use client";
import React, { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

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
                </div>
                <div className="flex gap-3 min-w-[300px]">
                <div className="flex gap-3 min-w-[300px]">
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MIN</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={minWinRatio} onChange={e => setMinWinRatio(Number(e.target.value))} />
                    </div>
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MAX</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={maxWinRatio} onChange={e => setMaxWinRatio(Number(e.target.value))}/>
                    </div>
                    {/* <Slider
                        defaultValue={[filter.minGrowth, filter.maxGrowth]}
                        min={1}
                        max={5000} 
                        step={10}
                        onValueChange={
                        (e) => {
                            setMinGrowth(Number(e[0]));
                            setMaxGrowth(Number(e[1]));
                            }}
                        /> */}
                    <Button onClick={() => handleChange()}>
                        <Check width={15}/>
                    </Button>
                </div>
                    {/* <Slider
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
                    </Button> */}
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default WinRatioControl