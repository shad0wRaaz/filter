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
                    <p className={style.filterLabel}>Min. Balance </p>
                    <p className={style.filterValue}> {Intl.NumberFormat('en-US').format(filter.minBalance)}</p>
                </div>
                {/* <PlusCircle className={ style.badgeIcon } /> */}
                {/* <span>Min. Balance: {filter.minBalance}</span> */}
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <b>Minimum Balance</b>
            <div className="flex gap-3">
                <Input 
                    type="number" 
                    value={minBalance} 
                    onChange={(e) => setMinBalance(e.target.value)}
                />
                <Button onClick={() => handleChange()}>
                    <Check width={15}/>
                </Button>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default MinimumBalanceControl