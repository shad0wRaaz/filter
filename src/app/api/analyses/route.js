
import { NextResponse } from 'next/server';
import { API_URL, authKey } from '@/lib/utils';
import { decryptData } from '@/lib/encryption';


export async function POST(req){
    try{
        const body = await req.json()
        const accountId = body.ai;
        const apiKey = body.ak;
        const secretKey = body.sk;
        const type = body.type;

        let fetchURL = "";

        if(type == "normal") { fetchURL = `${API_URL}/analyses/${accountId}` }
        else if(type == "all") { fetchURL = `${API_URL}/analyses` }
        else if(type == "hours") { fetchURL = `${API_URL}/analyses/${accountId}/hours` }
        else if(type == "daily") { fetchURL = `${API_URL}/analyses/${accountId}/dailies` }
        else if(type == "day") { fetchURL = `${API_URL}/analyses/${accountId}/days` }
        else if(type == "monthly") { fetchURL = `${API_URL}/analyses/${accountId}/monthlies` }
        else if(type == "monthlysymbol") { fetchURL = `${API_URL}/analyses/${accountId}/monthly-symbols` }

        const response = await fetch(fetchURL, {
            headers: {
                'Authorization': authKey(decryptData(apiKey), decryptData(secretKey)),
            }
        });
    
        const analyses = await response.json();
        return NextResponse.json(analyses);

    }catch(err){
        console.log(err)
        return NextResponse.json({ status: 500, message: "Error in fetching"})
    }
}
