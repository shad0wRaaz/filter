
import { NextResponse } from 'next/server';
import { API_URL, authKey } from '@/lib/utils';
import { decryptData } from '@/lib/encryption';


export async function POST(req){
    try{
        const body = await req.json();
        const accountid = body.ai;
        const apiKey = body.ak;
        const secretKey = body.sk;
        const type = body.type;
        const limit = body.limit;

        let response;

        if(type == "fetch"){
            const fetchURL = `${API_URL}/trades?account_id=${accountid}&order=asc&limit=${limit}`;

            response = await fetch(fetchURL, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authKey(apiKey, secretKey),
                }
            });
        }
        
        const accounts = await response.json();
        return NextResponse.json(accounts);

    }catch(err){
        console.log(err)
        return NextResponse.json({ status: 500, message: "Error in getting accounts"})
    }


}
