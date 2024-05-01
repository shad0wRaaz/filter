import { NextResponse } from 'next/server';
import { API_URL, authKey } from '@/lib/utils';
import { decryptData } from '@/lib/encryption';

export async function POST(req){
    try{
        const body = await req.json();
        const apiKey = body.ak;
        const secretKey = body.sk;
    
        const fetchURL = `${API_URL}/brokers/`;
        
        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authKey(apiKey, secretKey),
            }
        });
        const accounts = await response.json();
        return NextResponse.json(accounts);

    }catch(err){
        return NextResponse.json({ status: 500, message: "Error in getting accounts"})
    }
}
