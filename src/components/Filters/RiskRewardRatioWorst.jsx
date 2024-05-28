"use client";
import React, { useState } from 'react'
import { Slider } from '../ui/slider'
import { useFilter } from '@/contexts/FilterContext'
import { Button } from '../ui/button';
import { Check, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

const RiskRewardRatioWorstLoss = ({style}) => {
    const {filter, setFilter} = useFilter();
    const [minRiskRewardWorst, setMinRiskRewardWorst] = useState(filter ? filter.minRiskRewardWorst : 0);
    const [maxRiskRewardWorst, setMaxRiskRewardWorst] = useState(filter ? filter.maxRiskRewardWorst : 0);
  return (
    <Popover>
        <PopoverTrigger>
            <Badge className={ style.filterBadge }>
                <PlusCircle className={ style.badgeIcon } />
                <span>RRR (Worst Loss): {filter.minRiskRewardWorst} - {filter.maxRiskRewardWorst}</span>
            </Badge>
        </PopoverTrigger>
        <PopoverContent className={style.popoverContent}>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <b>Risk Reward Ratio (Worst Loss)</b>
                    <span>{minRiskRewardWorst} to {maxRiskRewardWorst}</span>
                </div>
                <div className="flex gap-3 min-w-[300px]">
                    <Slider
                        defaultValue={[filter.minRiskRewardWorst, filter.maxRiskRewardWorst]}
                        min={1}
                        max={10} 
                        step={1}
                        onValueChange={
                        (e) => {
                            setMinRiskRewardWorst(Number(e[0]));
                            setMaxRiskRewardWorst(Number(e[1]));
                            }}
                        />
                    <Button onClick={() => setFilter({ ...filter, minRiskRewardWorst, maxRiskRewardWorst})}>
                        <Check width={15}/>
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default RiskRewardRatioWorstLoss