import React from 'react'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { useFilter } from '@/contexts/FilterContext'
import { cn } from '@/lib/utils'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { CrossIcon } from '../icons/CustomIcons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWatchlist } from '@/contexts/WatchlistContext'

const SearchandWatchlistControl = ({selectedWatchlist, setSelectedWatchlist, style}) => {
    const {filter, setFilter} = useFilter();
    const {watchlistNames} = useWatchlist();
    // const [searchString, setSearchString] = useState(filter ? filter.searchQuery : "");

    const clearSearchQuery = () => {
      setFilter({...filter, searchQuery: ""});
      localStorage.setItem("filters", JSON.stringify({ ...filter, searchQuery: "" }));
    }
    const handleSearchQuery = (value) => {
      setFilter({...filter, searchQuery: value})
      localStorage.setItem("filters", JSON.stringify({ ...filter, searchQuery: value }));
    }
  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute top-2 left-2 w-5 h-5"/>
        <Input 
            className={cn(style.input, " w-[250px] px-[35px]") } 
            placeholder="Search Account Number..." 
            value={filter.searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)} />
        {filter.searchQuery != "" && (
          <div 
            className="absolute top-2.5 right-1 w-5 h-5 z-10 cursor-pointer"
            onClick={() => clearSearchQuery()}>
            <CrossIcon />
          </div>
        )}
      </div>
      <Select onValueChange={e => setSelectedWatchlist(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="View Watchlist" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {watchlistNames && watchlistNames.length > 0 && watchlistNames.map(w => (
            <SelectItem key={w._id} value={w.listname}>{w.listname}</SelectItem>

          ))}
          {/* <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem> */}
        </SelectContent>
      </Select>
        {/* <div className="flex items-center space-x-2 justify-end mt-5 md:mt-0">
            <Label htmlFor="view-watchlist-only">View Watchlist</Label>
            <Switch 
                id="view-watchlist-only" 
                defaultChecked={watchlistOnly} 
                onCheckedChange={(e) => setWatchlistOnly(e)}
            />
        </div> */}
    </div>
  )
}

export default SearchandWatchlistControl