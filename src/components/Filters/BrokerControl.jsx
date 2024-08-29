"use client"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { useFilter } from "@/contexts/FilterContext"
import CircleCheck from "../ui/CircleCheck"
// 1073641
// 1073623
// 1073621
// 1073612
// 1073595
// 1073594
// 1073592
// 1073570
// 1073556
// 1073555
// 1073553
// 1073552
// 1073549
// 1073546
// 1073539
// 1073538
// 1073536
// 1073500
// 1073499

// 1014698
// 1014267
// 1014210
// 1013887
// 1013855
// 1013819










const BrokerControl = ({style, data})  => {
  const {filter, setFilter} = useFilter();
  const [open, setOpen] = useState(false);
  const [searchBrokerQuery, setSearchBrokerQuery] = useState("");

  if(!data || Object.keys(data)?.length === 0) return;
  const brokerArray = data?.map(account => account.broker);
  const brokerSet = new Set(brokerArray);
  const brokers = (Array.from(brokerSet).sort());

  const handleClick = (broker) => {
      setFilter({ ...filter, broker});
      localStorage.setItem("filters", JSON.stringify({ ...filter, broker }))
      setOpen(false)
  }
  return (
    <Popover>
      <PopoverTrigger>
        <Badge className={ style.filterBadge }>
          {/* <PlusCircle className={ style.badgeIcon } /> */}
          <div className={style.filterText}>
            <p className={style.filterLabel}>Broker </p>
            <p className={style.filterValue}> {filter.broker}</p>
          </div>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className={cn(style.popoverContent, "space-y-4 max-h-[300px] overflow-scroll p-4")}>
        <Input 
            placeholder="Search Broker..." 
            value={searchBrokerQuery}
            className={style.input} 
            onChange={e => setSearchBrokerQuery(e.target.value)}/>
        <div className="space-y-1">
            <div 
                className={cn("cursor-pointer flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-600 p-2 w-[250px] rounded-sm", filter.broker == "All" ? cn(style.selectedStyle, " border") : "")} 
                onClick={() => handleClick("All")}>
                All
                {filter.broker == "All" && <CircleCheck/>}
            </div>
            {brokers?.filter(broker => searchBrokerQuery != "" ? String(broker).toLowerCase().search(String(searchBrokerQuery).toLowerCase()) >= 0 : broker)?.map(broker => 
                                <div 
                                    className={cn("cursor-pointer items-center flex justify-between hover:bg-slate-100 dark:hover:bg-slate-600 p-2 w-[250px] rounded-sm", broker == filter.broker ? cn(style.selectedStyle, " border") : "")} 
                                    key={broker}
                                    onClick={() => handleClick(broker)}>
                                    {broker}
                                    {broker == filter.broker && <CircleCheck/>}
                                </div>
                            )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default BrokerControl