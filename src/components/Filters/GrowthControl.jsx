"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const GrowthControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minGrowth, setMinGrowth] = useState(filter ? filter.minGrowth : 0);
    const [maxGrowth, setMaxGrowth] = useState(filter ? filter.maxGrowth : 0);
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <PlusCircle className={ style.badgeIcon } />
                <span>Growth: {filter.minGrowth} - {filter.maxGrowth}%</span>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Growth Range</b>
                    <span>{minGrowth} to {maxGrowth}</span>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <Slider
                        defaultValue={[filter.minGrowth, filter.maxGrowth]}
                        min={1}
                        max={5000} 
                        step={10}
                        onValueChange={
                        (e) => {
                            setMinGrowth(Number(e[0]));
                            setMaxGrowth(Number(e[1]));
                            }}
                        />
                    <Button onClick={() => setFilter({ ...filter, minGrowth, maxGrowth})}>
                        <Check width={15}/>
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default GrowthControl