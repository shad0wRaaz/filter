"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const DrawdownControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minDrawdown, setMinDrawdown] = useState(filter ? filter.minDrawdown : 0);
    const [maxDrawdown, setMaxDrawdown] = useState(filter ? filter.maxDrawdown : 0);
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <PlusCircle className={ style.badgeIcon } />
                <span>Drawdown: {filter.minDrawdown} - {filter.maxDrawdown}%</span>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Drawdown Range</b>
                    <span>{minDrawdown} to {maxDrawdown}</span>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <Slider
                        defaultValue={[filter.minDrawdown, filter.maxDrawdown]}
                        min={1}
                        max={100} 
                        step={1}
                        onValueChange={
                        (e) => {
                            setMinDrawdown(Number(e[0]));
                            setMaxDrawdown(Number(e[1]));
                            }}
                        />
                    <Button onClick={() => setFilter({ ...filter, minDrawdown, maxDrawdown})}>
                        <Check width={15}/>
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default DrawdownControl