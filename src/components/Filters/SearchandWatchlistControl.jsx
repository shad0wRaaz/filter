import React from 'react'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { useFilter } from '@/contexts/FilterContext'
import { cn } from '@/lib/utils'

const SearchandWatchlistControl = ({watchlistOnly, setWatchlistOnly, style}) => {
    const {filter, setFilter} = useFilter();

    const handleSearchQuery = (searchString) => {
      setFilter({...filter, searchQuery: searchString})
      localStorage.setItem("filters", JSON.stringify({ ...filter, searchQuery: searchString }));
    }
  return (
    <div className="flex justify-between items-center">
        <Input 
                className={cn(style.input, " w-[200px]") } 
                placeholder="Search Account Number..." 
                value={filter.searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)} />
        <div className="flex items-center space-x-2 justify-end mt-5 md:mt-0">
            <Label htmlFor="view-watchlist-only">View Watchlist</Label>
            <Switch 
                id="view-watchlist-only" 
                defaultChecked={watchlistOnly} 
                onCheckedChange={(e) => setWatchlistOnly(e)}
            />
        </div>
    </div>
  )
}

export default SearchandWatchlistControl