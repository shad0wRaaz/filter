
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

        let response;

        if(type == "fetch"){
            const fetchURL = accountid ? `${API_URL}/accounts/${accountid}` : `${API_URL}/accounts`;
            
            response = await fetch(fetchURL, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authKey(apiKey, secretKey),
                }
            });
        }else if(type == "save"){
            const fbody = {
                "account_name": body.account,
                "mt_version": Number(body.version),
                "account_number": Number(body.number),
                "password": body.password,
                "broker_server_id": Number(body.server),
            }
            response = await fetch(`${API_URL}/accounts`, {
                method: 'POST',
                body: JSON.stringify(fbody),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authKey(apiKey, secretKey),
                }
            });
        }
        
        const accounts = await response.json();
        return NextResponse.json(accounts);

    }catch(err){
        return NextResponse.json({ status: 500, message: "Error in getting accounts"})
    }


}
