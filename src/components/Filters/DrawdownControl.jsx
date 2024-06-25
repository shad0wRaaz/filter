"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const DrawdownControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minDrawdown, setMinDrawdown] = useState(filter ? filter.minDrawdown : 0);
    const [maxDrawdown, setMaxDrawdown] = useState(filter ? filter.maxDrawdown : 0);

    const handleChange = () => {
        setFilter({ ...filter, minDrawdown, maxDrawdown});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minDrawdown, maxDrawdown }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                {/* <PlusCircle className={ style.badgeIcon } /> */}
                <div className={style.filterText}>
                  <p className={style.filterLabel}>Drawdown</p>
                  <p className={style.filterValue}>{filter.minDrawdown} - {filter.maxDrawdown}</p>
                </div>
                {/* <span>Drawdown: {filter.minDrawdown} - {filter.maxDrawdown}%</span> */}
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Drawdown</b>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <div className="flex gap-3 min-w-[300px]">
                        <div className="relative">
                            <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MIN</Badge>
                            <Input className="w-32 pl-[45px]" type="number" value={minDrawdown} onChange={e => setMinDrawdown(Number(e.target.value))} />
                        </div>
                        <div className="relative">
                            <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MAX</Badge>
                            <Input className="w-32 pl-[45px]" type="number" value={maxDrawdown} onChange={e => setMaxDrawdown(Number(e.target.value))}/>
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
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default DrawdownControl