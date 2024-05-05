"use client";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { useFilter } from '@/contexts/FilterContext'
import { PlusCircle } from "lucide-react";

const style = {
  filterBox: "p-2 flex gap-3 flex-col w-full ",
  filterBadge: "justify-center relative rounded-[5px] bg-transparent border-dashed text-[#14B8A6] border-[#14B8A6] bg-white dark:bg-teal-900 hover:bg-white flex grow md:grow-0 gap-1 py-2 justify-between hover:text-md transition-all justify-center",
  badgeIcon: "h-3 w-3",
  input: "w-full md:w-auto h-9 text-sm !rounded-[7px] dark:bg-slate-700",
}

const Filters = ({ filterType, unsavedFilter, setUnsavedFilter}) => {

  const { filter, setFilter } = useFilter();
  if(filterType == "items" && unsavedFilter){
    return (
      <div className="flex items-center justify-between flex-wrap mt-5">
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Account Type</Label>
          <Select onValueChange={(e) => setUnsavedFilter({ ...unsavedFilter, accountType: e})}>
            <SelectTrigger className="w-100">
              <SelectValue placeholder={unsavedFilter.accountType}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Real">Real</SelectItem>
              <SelectItem value="Demo">Demo</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Copier Status</Label>
          <Select onValueChange={(e) => setUnsavedFilter({ ...unsavedFilter, accountNature: e })} >
            <SelectTrigger className="w-100">
              <SelectValue placeholder={unsavedFilter.accountNature} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Follower">Follower</SelectItem>
              <SelectItem value="Standalone">Standalone</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Minimum Account Balance</Label>
          <Input type="number" value={unsavedFilter.minBalance} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, minBalance: Number(e.target.value) })}></Input>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Growth %</Label>
          <Input type="number" value={unsavedFilter.profitability} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, profitability: Number(e.target.value) })}></Input>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Win Ratio</Label>
          <div className="flex gap-2 flex-wrap justify-between flex-row items-center">
            <Input type="number" placeholder="Min." className="w-[40%]" value={unsavedFilter.minWinRatio} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, minWinRatio: Number(e.target.value) })}></Input>
            <span>to</span>
            <Input type="number" placeholder="Max." className="w-[40%]" value={unsavedFilter.maxWinRatio} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, maxWinRatio: Number(e.target.value) })}></Input>
          </div>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Risk Reward (Average Loss)</Label>
          <Input type="number" value={unsavedFilter.riskRewardAverage} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, riskRewardAverage: Number(e.target.value) })}></Input>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Risk Reward (Worst Loss)</Label>
          <Input type="number" value={unsavedFilter.riskRewardWorst} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, riskRewardWorst: Number(e.target.value) })}></Input>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Maximum Drawdown %</Label>
          <Input type="number" value={unsavedFilter.maxDrawdown} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, maxDrawdown: Number(e.target.value) })}></Input>
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Track Record History</Label>
          <Select onValueChange={(e) => setUnsavedFilter({ ...unsavedFilter, trackRecord: e})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`upto ${filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} ${unsavedFilter.trackRecord == 12 || unsavedFilter.trackRecord == 24 ? unsavedFilter.trackRecord == 12 ? "year" : "years" : "months"}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">upto 3 months</SelectItem>
              <SelectItem value="6">upto 6 months</SelectItem>
              <SelectItem value="9">upto 9 months</SelectItem>
              <SelectItem value="12">upto 1 year</SelectItem>
              <SelectItem value="24">upto 2 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* <div className={ style.filterBox }>
          <Label htmlFor="terms">Minimum No. of Copiers</Label>
          <Input type="number" value={unsavedFilter.minCopier} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, minCopier: Number(e.target.value) })}></Input>
        </div> */}
      </div>
    )
  }else{
    return(
      <div className="flex items-center flex-wrap justify-start gap-1.5">
          <Input 
            className={ style.input } 
            placeholder="Search Account..." 
            value={filter.searchQuery}
            onChange={(e) => setFilter({...filter, searchQuery: e.target.value})} />
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Account Type: {filter.accountType}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Copier Status: {filter.accountNature}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Min. Balance: {filter.minBalance}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Growth: {filter.profitability}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Win Ratio: {filter.minWinRatio} - {filter.maxWinRatio}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Max. Drawdown: {filter.maxDrawdown}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>RRR (Avg. Loss): {filter.riskRewardAverage}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>RRR (Worst Loss): {filter.riskRewardWorst}</span>
          </Badge>
          {/* <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Min. No. of Copier: {filter.minCopier}</span> */}
            {/* <Cross2Icon className="cursor-pointer" /> */}
          {/* </Badge> */}
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Track Record: upto {filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} {filter.trackRecord == "12" || filter.trackRecord == "24" ? filter.trackRecord == "12" ? "year" : "years" : "months"}</span>
          </Badge>
      </div>
    )
  }
}

export default Filters