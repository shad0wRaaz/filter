"use client";
import React, { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const GrowthControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minGrowth, setMinGrowth] = useState(filter ? filter.minGrowth : 0);
    const [maxGrowth, setMaxGrowth] = useState(filter ? filter.maxGrowth : 0);
    
    const handleChange = () => {
        setFilter({ ...filter, minGrowth, maxGrowth});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minGrowth, maxGrowth }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <div className={style.filterText}>
                    <p className={style.filterLabel}>Growth</p>
                    <p className={style.filterValue}> {filter.minGrowth} - {filter.maxGrowth}</p>
                </div>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Growth</b>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MIN</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={minGrowth} onChange={e => setMinGrowth(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MAX</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={maxGrowth} onChange={e => setMaxGrowth(e.target.value)}/>
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
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default GrowthControl