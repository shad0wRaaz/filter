import { connectToDatabase } from '@/lib/mongoClient';
import { NextResponse } from 'next/server';


export async function GET(req){
  try{
    const db = await connectToDatabase();
    const collection = db.collection("Settings");

    const username = req.nextUrl.searchParams.get("u");

    const allSettings = await collection.findOne({ username });

    return NextResponse.json(allSettings);
  }catch(err){
    console.log("error", err)
    return NextResponse.json(err);
  }
}

export async function POST(req, res){
    try{
        const { username, secretKey, apiKey } = await req.json();

        const db = await connectToDatabase();
        const collection = db.collection("Settings");
        
        const item = await collection.insertOne({
            username, secretKey, apiKey, createdAt: new Date(),
        });

        if(item.acknowledged == true){
            if(item.modifiedCount == 1){
                return NextResponse.json({ status: 200, message: 'Settings has been saved.'});
            }else{
                return NextResponse.json({ status: 200 , message: 'Settings were not saved.'});
            }
        }

    }catch(err){
        return NextResponse.json({err});
    }
}

export async function PATCH(req, res){
    try{
        const { username, secretKey, apiKey } = await req.json();
        // console.log(username, secretKey, apiKey)

        const db = await connectToDatabase();
        const collection = db.collection("Settings");
        
        const item = await collection.updateOne(
           { username }, 
           {
            $set: {
                secretKey, 
                apiKey
            }
           }
        );
        if(item.acknowledged == true){
            if(item.modifiedCount == 1){
                return NextResponse.json({ status: 200, message: 'Settings has been updated.'});
            }else{
                return NextResponse.json({ status: 200 , message: 'Settings were not updated.'});
            }
        }  


    }catch(err){
        console.log(err)
        return NextResponse.json({ status: 500, message: err});
    }
}