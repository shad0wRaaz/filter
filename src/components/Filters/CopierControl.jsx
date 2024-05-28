"use client";
import { useFilter } from '@/contexts/FilterContext';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import CircleCheck from '../ui/CircleCheck';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { PlusCircle } from 'lucide-react';

const CopierControl = ({style}) => {
    const {filter, setFilter} = useFilter();
    const handleSelect = (type) => {
      // setSelected(type);
      setFilter({...filter, accountNature: type})
    }
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <PlusCircle className={ style.badgeIcon } />
                <span>Copier Status: {filter.accountNature}</span>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <b>Choose Copier Status</b>
            <div className="flex w-auto">
                <div 
                  className={cn(style.general, filter.accountNature == "All" ? style.selectedStyle : "")} 
                  onClick={() => handleSelect("All")}>
                    All
                    {filter.accountNature == "All" && <CircleCheck w={12} h={12}/> }
                </div>
                <div 
                  className={cn(style.general, filter.accountNature == "Lead" ? style.selectedStyle : "")} 
                  onClick={() => handleSelect("Lead")}>
                    Lead
                    {filter.accountNature == "Lead" && <CircleCheck w={12} h={12}/> }
                </div>
                <div 
                  className={cn(style.general, filter.accountNature == "LS" ? style.selectedStyle : "")} 
                  onClick={() => handleSelect("Lead and Standalone")}>
                    Lead and Standalone
                    {filter.accountNature == "Lead and Standalone" && <CircleCheck w={12} h={12}/> }
                </div>
                <div 
                  className={cn(style.general, filter.accountNature == "Follower" ? style.selectedStyle : "")} 
                  onClick={() => handleSelect("Follower")}>
                    Follower
                    {filter.accountNature == "Follower" && <CircleCheck w={12} h={12}/> }
                </div>
                <div 
                  className={cn(style.general, filter.accountNature == "Standalone" ? style.selectedStyle : "")} 
                  onClick={() => handleSelect("Standalone")}>
                    Standalone
                    {filter.accountNature == "Standalone" && <CircleCheck w={12} h={12}/> }
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default CopierControl