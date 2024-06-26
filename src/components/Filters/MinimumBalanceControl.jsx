"use client";
import { useFilter } from '@/contexts/FilterContext'
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const MinimumBalanceControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minBalance, setMinBalance]= useState(filter ? filter.minBalance : 0)

    const handleChange = () => {
        setFilter({ ...filter, minBalance});
        localStorage.setItem("filters", JSON.stringify({ ...filter, minBalance }));
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <div className={style.filterText}>
                    <p className={style.filterLabel}>Balance </p>
                    <p className={style.filterValue}> {Intl.NumberFormat('en-US').format(filter.minBalance)}</p>
                </div>
                {/* <PlusCircle className={ style.badgeIcon } /> */}
                {/* <span>Min. Balance: {filter.minBalance}</span> */}
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <b>Balance</b>
            <div className="flex gap-3">
                <div className="relative">
                <Badge className="absolute top-2.5 left-2 opacity-80 rounded-sm text-[10px] p-1 py-0"  variant="secondary">MIN</Badge>
                    <Input 
                        className="pl-[45px]"
                        type="number" 
                        value={minBalance} 
                        onChange={(e) => setMinBalance(Number(e.target.value))}
                    />
                </div>
                <Button className={style.button} onClick={() => handleChange()}>
                    <Check width={15} className={style.button}/>
                </Button>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default MinimumBalanceControl