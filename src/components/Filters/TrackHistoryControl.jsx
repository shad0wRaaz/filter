import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { PlusCircle } from 'lucide-react'
import { useFilter } from '@/contexts/FilterContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'

const TrackHistoryControl = ({style}) => {
    const {filter, setFilter} = useFilter();
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <PlusCircle className={ style.badgeIcon } />
                <span>Track Record: Above {filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} {filter.trackRecord == "12" || filter.trackRecord == "24" ? filter.trackRecord == "12" ? "year" : "years" : "months"}</span>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={cn(style.popoverContent," w-[250px]")}>
            <b>Track History</b>
            <Select onValueChange={(e) => setFilter({ ...filter, trackRecord: e})}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder={`Above ${filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} ${filter.trackRecord == 12 || filter.trackRecord == 24 ? filter.trackRecord == 12 ? "year" : "years" : "months"}`} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="3">Above 3 months</SelectItem>
                <SelectItem value="6">Above 6 months</SelectItem>
                <SelectItem value="9">Above 9 months</SelectItem>
                <SelectItem value="12">Above 1 year</SelectItem>
                <SelectItem value="24">Above 2 years</SelectItem>
                </SelectContent>
            </Select>
        </PopoverContent>
    </Popover>
  )
}

export default TrackHistoryControl