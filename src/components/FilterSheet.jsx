"use client";
import React, { useState } from 'react'
import Filters from './Filters'
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MixerHorizontalIcon, SliderIcon } from '@radix-ui/react-icons'
import { useFilter } from '@/contexts/FilterContext';
import { toast } from 'sonner';

const FilterSheet = () => {
    const { filter, setFilter } = useFilter();
    const [unsavedFilter, setUnsavedFilter] = useState({...filter});

    const handleUpdateFitler = () => {
        setFilter({...unsavedFilter});
        localStorage.setItem("filters", JSON.stringify({ ...unsavedFilter }))
    }
    
    const handleFilterReset = () => {
        const defaultFilters = {
            searchQuery: "",
            accountType: "Real", 
            accountNature: "All", 
            trackRecord: 6,
            profitability:  -100,
            minWinRatio: 0,
            maxWinRatio: 100,
            minBalance: 0,
            maxDrawdown: 100,
            riskRewardAverage: 0,
            riskRewardWorst: 0,
            minCopier: 0,
        };
        setFilter(defaultFilters);
        setUnsavedFilter(defaultFilters);
        localStorage.setItem("filters", JSON.stringify(defaultFilters));
        toast("Filter settings has been reset.");
    }

  return (
    <div className="flex gap-2 justify-between flex-wrap md:flex-nowrap flex-row">
        <Filters/>
        <Sheet>
            <div className="flex gap-2">
                <SheetTrigger asChild>
                    <Button className="flex items-center justify-center gap-1 bg-blue-500 w-full md:w-auto mt-3 md:mt-0">
                        <MixerHorizontalIcon/> <span>Filter</span>
                    </Button>
                </SheetTrigger>
                <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-1 w-full md:w-auto mt-3 md:mt-0"
                    onClick={() => handleFilterReset()}>
                    <SliderIcon/> <span>Reset</span>
                </Button>
            </div>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                    Make changes to filters here. Click save when you're done.
                </SheetDescription>
                </SheetHeader>
                    <Filters filterType="items" unsavedFilter={unsavedFilter} setUnsavedFilter={setUnsavedFilter} />
                <SheetFooter>
                <SheetClose asChild>
                    <Button 
                        type="button" 
                        className="mr-2 mt-4"
                        onClick={() => handleUpdateFitler()}>Update Filter</Button>
                </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default FilterSheet