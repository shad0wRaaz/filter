"use client";
import React, { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const LeverageControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minLeverage, setMinLeverage] = useState(filter ? filter.minLeverage : 0);
    const [maxLeverage, setMaxLeverage] = useState(filter ? filter.maxLeverage : 0);
    
    const handleChange = () => {
        setFilter({ ...filter, minLeverage, maxLeverage});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minLeverage, maxLeverage }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <div className={style.filterText}>
                    <p className={style.filterLabel}>Leverage</p>
                    <p className={style.filterValue}> {filter.minLeverage} - {filter.maxLeverage}</p>
                </div>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Leverage</b>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MIN</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={minLeverage} onChange={e => setMinLeverage(Number(e.target.value))} />
                    </div>
                    <div className="relative">
                        <Badge className="absolute top-2.5 left-2 opacity-80 rounded-[6px] text-[10px] p-1 py-0"  variant="secondary">MAX</Badge>
                        <Input className="w-32 pl-[45px]" type="number" value={maxLeverage} onChange={e => setMaxLeverage(Number(e.target.value))}/>
                    </div>
                    {/* <Slider
                        defaultValue={[filter.minLeverage, filter.maxLeverage]}
                        min={1}
                        max={5000} 
                        step={10}
                        onValueChange={
                        (e) => {
                            setMinLeverage(Number(e[0]));
                            setMaxLeverage(Number(e[1]));
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

export default LeverageControl