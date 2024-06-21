import React, { useState } from 'react'
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cross2Icon } from '@radix-ui/react-icons'

const TradeFilterControl = ({ tradeState, setTradeState, tradeType, setTradeType, uniqueTypes, date, setDate }) => {
  return (
    <div className="my-4 flex justify-end gap-3">
        <div className={cn("grid gap-2")}>
            Date Range
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[300px] justify-start text-left font-normal relative",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date && <Cross2Icon className="mr-2 h-4 w-4 absolute right-2" onClick={() => setDate()} />}
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Select Date Range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
        </div>
        <div>
            <p className="mb-2">Trade Type</p>
            <Select 
                className="mr-2 mt-1"
                onValueChange={e => setTradeType(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tradeType} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All</SelectItem>
                        {uniqueTypes?.map(type => 
                            <SelectItem key={type} value={type}><span className="capitalize">{type}</span></SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div>
            <p className="mb-2">Trade State</p>
            <Select 
                className="mr-2 mt-1"
                onValueChange={e => setTradeState(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tradeState} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default TradeFilterControl

const DatePickerWithRange = ({className}) => {
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })
}