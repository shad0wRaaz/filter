"use client";
import React, { useState } from 'react'
import Filters from './Filters'
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MixerHorizontalIcon, SliderIcon } from '@radix-ui/react-icons'
import { useFilter } from '@/contexts/FilterContext';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const FilterSheet = ({ watchlistOnly, setWatchlistOnly}) => {
    const { filter, setFilter } = useFilter();
    const [unsavedFilter, setUnsavedFilter] = useState({...filter});

    const handleUpdateFitler = () => {
        setFilter({...unsavedFilter});
        localStorage.setItem("filters", JSON.stringify({ ...unsavedFilter }))
    }
    
    const handleFilterReset = () => {
        const defaultFilters = {
            searchQuery: "",
            accountNature: "All", 
            trackRecord: 6,
            minGrowth:  -100,
            maxGrowth: 100,
            minWinRatio: 0,
            maxWinRatio: 100,
            minBalance: 0,
            minDrawdown: 0,
            maxDrawdown: 100,
            minRiskRewardAverage: 0,
            maxRiskRewardAverage: 100,
            minRiskRewardWorst: 0,
            maxRiskRewardWorst: 100,
        };
        setFilter(defaultFilters);
        setUnsavedFilter(defaultFilters);
        localStorage.setItem("filters", JSON.stringify(defaultFilters));
        toast("Filter settings has been reset.");
    }

  return (
    <div className="flex gap-2 flex-wrap md:flex-nowrap flex-col justify-end">
        <Filters/>
        <Sheet>
            <div className="flex gap-2 justify-between items-center mt-2">
                <div className="flex items-center space-x-2 justify-end mt-5 md:mt-0">
                    <Label htmlFor="view-watchlist-only">View Watchlist only</Label>
                    <Switch 
                        id="view-watchlist-only" 
                        defaultChecked={watchlistOnly} 
                        onCheckedChange={(e) => setWatchlistOnly(e)}
                    />
                </div>
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
            </div>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
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