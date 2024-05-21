// "use client";
// import { useUser } from '@/contexts/UserContext'
// import { MY_API_URL } from '@/lib/utils'
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'

// const WatchlistPopoverItem = ({ account, index }) => {
//     if(index >= 5) return
//     const {user} = useUser();
//     const [myAnalysisData, setMyAnalysisData] = useState();
    
//     useEffect(() => {
//         if(!user) return;

//         ;(async() => {
//             const analysis = await getGrowth(account.watchlist, user);
//             setMyAnalysisData({...analysis?.data});
//         })();

//         return() => { 
//             //do nothing
//         }
//     }, [user]);


//   return (
//     <>
//         <Link href={`/portfolio/${ account.watchlist }`}>
//             <div className="flex justify-between p-2 hover:bg-slate-100 hover:dark:bg-slate-700 rounded-md cursor-pointer">
//                 {account.watchlist}
//                 <div className={`${Number(myAnalysisData?.growth) > 0 ? "text-green-400  border-green-400" : "text-red-400 border-red-400" } border rounded-sm text-xs p-2 py-1`}>
//                     {Math.floor(Number(myAnalysisData?.growth))}%
//                 </div>
//             </div>
//         </Link>
//     </>
//   )
// }

// export default WatchlistPopoverItem


// const getGrowth = async (id, user) => {
//     const fetchData = await fetch(`${MY_API_URL}/analyses?type=normal&ai=${id}&ak=${user.apiKey}&sk=${user.secretKey}`).then(res => res.json());
//     return fetchData;
// }
