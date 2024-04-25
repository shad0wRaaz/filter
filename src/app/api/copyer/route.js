import { NextRequest, NextResponse } from "next/server";
import { API_URL, authKey } from '@/lib/utils';
import { decryptData } from '@/lib/encryption';

export async function GET(){
    // try{
    //     const fetchURL = `${API_URL}/copiers/`;
    //     const response = await fetch(fetchURL, {
    //             headers: {
    //                 'Authorization': authKey(decryptData(apiKey), decryptData(secretKey)),
    //             }
    //         });
    
    //     const accounts = await response.json();
    
    //     return NextResponse.json(accounts);

    // }catch(err){
    //     return NextResponse.json({ status: 500, message: "Error in fetching copier"})
    // }
}

export async function POST(req, res){
    try{
        const body = await req.json();
        const type = body.type;
        const apiKey = body.ak;
        const secretKey = body.sk;
        const copyObject = body.copyObject;

        if(type == "create"){
            const response = await fetch(`${API_URL}/copiers/`,{
                method: 'POST',
                body: JSON.stringify(copyObject),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authKey(decryptData(apiKey), decryptData(secretKey)),
                }
            });
        
            const accounts = await response.json();
            return NextResponse.json(accounts);
        }else if(type == "fetch"){
            const fetchURL = `${API_URL}/copiers/`;
            const response = await fetch(fetchURL, {
                headers: {
                    'Authorization': authKey(decryptData(apiKey), decryptData(secretKey)),
                }
            });
            
            const accounts = await response.json();
            return NextResponse.json(accounts);

        }
    }catch(err){
        return NextResponse.json({ status: 500, message: "Error in creating copier"})
    }
}

export async function DELETE(req, res){
    try{
        const { id } = await req.json();
        const response = await fetch(`${API_URL}/copiers/${id}`,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': authKey(decryptData(apiKey), decryptData(secretKey)),
            }
        });
        
        const accounts = await response.json();
        
        return NextResponse.json(accounts);
    }catch(err){
        return NextResponse.json({ status: 500, message: "Error in deleting copier"})
    }
}