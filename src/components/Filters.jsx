"use client";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { useFilter } from '@/contexts/FilterContext'
import { PlusCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider"



const style = {
  filterBox: "p-2 flex gap-3 flex-col w-full border rounded-md p-3 shadow-sm",
  label: "flex justify-between items-center",
  value: "bg-slate-100 rounded-sm text-sm p-2",
  filterBadge: "justify-center relative rounded-[5px] bg-transparent border-dashed text-[#14B8A6] border-[#14B8A6] bg-white dark:bg-teal-900 hover:bg-white flex grow md:grow-0 gap-1 py-2 justify-between hover:text-md transition-all justify-center",
  badgeIcon: "h-3 w-3",
  input: "w-full h-9 text-sm !rounded-[7px] dark:bg-slate-700",
}

const Filters = ({ filterType, unsavedFilter, setUnsavedFilter}) => {

  const { filter, setFilter } = useFilter();
  if(filterType == "items" && unsavedFilter){
    return (
      <div className="flex items-center justify-between flex-wrap gap-3 mt-5">
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
          <div className={style.label}>
            <Label htmlFor="terms">Growth</Label>
            <div className={style.value}>{unsavedFilter.minGrowth}% to {unsavedFilter.maxGrowth}%</div>
          </div>
          <Slider 
            defaultValue={[filter.minGrowth, filter.maxGrowth]}
            min={-100}
            max={100} 
            step={1}
            onValueChange={
              (e) => setUnsavedFilter(
                { 
                  ...unsavedFilter, 
                  minGrowth: Number(e[0]),
                  maxGrowth: Number(e[1]),

                }
              )}
            />
          {/* <Input type="number" value={unsavedFilter.profitability} onChange={(e) => setUnsavedFilter({ ...unsavedFilter, profitability: Number(e.target.value) })}></Input> */}
        </div>

        <div className={ style.filterBox }>
          <div className={style.label}>
            <Label htmlFor="terms">Win Ratio</Label>
            <div className={style.value}>{unsavedFilter.minWinRatio} to {unsavedFilter.maxWinRatio}</div>
          </div>
          <Slider 
            defaultValue={[filter.minWinRatio, filter.maxWinRatio]} 
            max={100} 
            step={1}
            onValueChange={
              (e) => setUnsavedFilter(
                { 
                  ...unsavedFilter, 
                  minWinRatio: Number(e[0]),
                  maxWinRatio: Number(e[1]),

                }
              )}
            />

        </div>
        <div className={ style.filterBox }>
          <div className={style.label}>
            <Label htmlFor="terms">Risk Reward (Average Loss)</Label>
            <div className={style.value}>{unsavedFilter.minRiskRewardAverage} to {unsavedFilter.maxRiskRewardAverage}</div>
          </div>
          <Slider 
            defaultValue={[filter.minRiskRewardAverage, filter.maxRiskRewardAverage]} 
            max={100} 
            step={1}
            onValueChange={
              (e) => setUnsavedFilter(
                { 
                  ...unsavedFilter, 
                  minRiskRewardAverage: Number(e[0]),
                  maxRiskRewardAverage: Number(e[1]),

                }
              )}
            />

        </div>
        <div className={ style.filterBox }>
          <div className={style.label}>
            <Label htmlFor="terms">Risk Reward (Worst Loss)</Label>
            <div className={style.value}>{unsavedFilter.minRiskRewardWorst} to {unsavedFilter.maxRiskRewardWorst}</div>
          </div>
          <Slider 
            defaultValue={[filter.minRiskRewardWorst, filter.maxRiskRewardWorst]} 
            max={100} 
            step={1}
            onValueChange={
              (e) => setUnsavedFilter(
                { 
                  ...unsavedFilter, 
                  minRiskRewardWorst: Number(e[0]),
                  maxRiskRewardWorst: Number(e[1]),

                }
              )}
            />
        </div>
        <div className={ style.filterBox }>
          <div className={style.label}>
            <Label htmlFor="terms">Drawdown %</Label>
            <div className={style.value}>{unsavedFilter.minDrawdown} to {unsavedFilter.maxDrawdown}</div>
          </div>
          <Slider 
            defaultValue={[filter.minDrawdown, filter.maxDrawdown]} 
            max={100} 
            step={1}
            onValueChange={
              (e) => setUnsavedFilter(
                { 
                  ...unsavedFilter, 
                  minDrawdown: Number(e[0]),
                  maxDrawdown: Number(e[1]),

                }
              )}
            />
        </div>
        <div className={ style.filterBox }>
          <Label htmlFor="terms">Track Record History</Label>
          <Select onValueChange={(e) => setUnsavedFilter({ ...unsavedFilter, trackRecord: e})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Above ${filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} ${unsavedFilter.trackRecord == 12 || unsavedFilter.trackRecord == 24 ? unsavedFilter.trackRecord == 12 ? "year" : "years" : "months"}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Above 3 months</SelectItem>
              <SelectItem value="6">Above 6 months</SelectItem>
              <SelectItem value="9">Above 9 months</SelectItem>
              <SelectItem value="12">Above 1 year</SelectItem>
              <SelectItem value="24">Above 2 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }else{
    return(
      <div className="flex items-center flex-wrap justify-start gap-3">
        <div className="flex-grow">
            <Input 
              className={ style.input } 
              placeholder="Search Account..." 
              value={filter.searchQuery}
              onChange={(e) => setFilter({...filter, searchQuery: e.target.value})} />
        </div>
        <div className="flex items-center flex-wrap justify-start gap-3">
          {/* <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Account Type: {filter.accountType}</span>
          </Badge> */}
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Account Type: {filter.accountNature}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Broker: {filter.broker}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Min. Balance: {filter.minBalance}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Growth: {filter.minGrowth} - {filter.maxGrowth}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Win Ratio: {filter.minWinRatio} - {filter.maxWinRatio}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Drawdown: {filter.minDrawdown} - {filter.maxDrawdown}%</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>RRR (Avg. Loss): {filter.minRiskRewardAverage} - {filter.maxRiskRewardAverage}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>RRR (Worst Loss): {filter.minRiskRewardWorst} - {filter.maxRiskRewardWorst}</span>
          </Badge>
          <Badge className={ style.filterBadge }>
            <PlusCircle className={ style.badgeIcon } />
            <span>Track Record: Above {filter.trackRecord == 12 || filter.trackRecord == 24 ? Number(filter.trackRecord) / 12 : filter.trackRecord} {filter.trackRecord == "12" || filter.trackRecord == "24" ? filter.trackRecord == "12" ? "year" : "years" : "months"}</span>
          </Badge>
        </div>
      </div>
    )
  }
}

export default Filters