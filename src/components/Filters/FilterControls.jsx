"use client";
import CopierControl from "./CopierControl";
import MinimumBalanceControl from "./MinimumBalanceControl";
import GrowthControl from "./GrowthControl";
import WinRatioControl from "./WinRatioControl";
import DrawdownControl from "./DrawdownControl";
import RiskRewardRatioAverageLoss from "./RiskRewardRatioAverage";
import RiskRewardRatioWorstLoss from "./RiskRewardRatioWorst";
import TrackHistoryControl from "./TrackHistoryControl";
import SearchandWatchlistControl from './SearchandWatchlistControl';
import BrokerControl from './BrokerControl';

const style = {
    filterBox: "p-2 flex gap-3 flex-col w-full border rounded-md p-3 shadow-sm",
    label: "flex justify-between items-center",
    value: "bg-slate-100 rounded-sm text-sm p-2",
    filterBadge: "hover:scale-105 relative rounded-md bg-transparent  text-[#14B8A6] text-gray-600 dark:text-slate-300 border-slate-200 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700 hover:bg-white flex grow md:grow-0 gap-1 py-2 justify-start items-start hover:text-md transition-all p-4 px-6",
    filterText: "text-left space-y-2",
    filterLabel: "text-[14px]",
    filterValue: "text-[16px] font-normal",
    badgeIcon: "h-3 w-3",
    input: "w-full h-9 text-sm !rounded-[7px] dark:bg-slate-800 dark:border-slate-500",
    popoverContent: "text-sm w-auto space-y-3 dark:bg-slate-800 dark:border-slate-700 shadow-md",
    general: 'flex gap-2 justify-between items-center p-2 w-fit px-3 border cursor-pointer transition border-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-600 dark:border-slate-600 rounded-md mx-1.5',
    selectedStyle: "border-blue-400 bg-blue-100 dark:border-slate-500 dark:bg-slate-600",
    button: "dark:text-white"
  }

const FilterControls = ({ selectedWatchlist, setSelectedWatchlist, data}) => {
    return (
        <div className="flex flex-wrap justify-start flex-col gap-3">
            <div className="flex items-center flex-wrap justify-start gap-3">
                <CopierControl style={style}/>

                <BrokerControl style={style} data={data}/>
                
                <MinimumBalanceControl style={style}/>
                
                <GrowthControl style={style}/>

                <WinRatioControl style={style}/>

                <DrawdownControl style={style}/>

                <RiskRewardRatioAverageLoss style={style}/>
                
                {/* <RiskRewardRatioWorstLoss style={style} /> */}

                <TrackHistoryControl style={style} />

            </div>
            <SearchandWatchlistControl style={style} selectedWatchlist={selectedWatchlist} setSelectedWatchlist={setSelectedWatchlist}/>
        </div>
    )
}

export default FilterControls