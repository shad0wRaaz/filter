import { connectToDatabase } from '@/lib/mongoClient';
import { NextResponse } from 'next/server';


export async function GET(req){
  try{
    const db = await connectToDatabase();
    const collection = db.collection("Watchlist");

    const username = req.nextUrl.searchParams.get("u");

    const watchlist = await collection.find({ username }).toArray();

    return NextResponse.json(watchlist);
  }catch(err){
    console.log("error", err)
    return NextResponse.json(err);
  }
}

export async function POST(req, res){
    try{
        const { username, watchlist } = await req.json();

        const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
        
        const existingWatchlist = await collection.find({ username, watchlist }).toArray();

        if(existingWatchlist.length == 0){
            const item = await collection.insertOne({
                username, watchlist, createdAt: new Date()
            });
            if(item.acknowledged == true){
                if(item?.insertedId){
                    return NextResponse.json({ status: 200, message: 'Watchlist has been saved.'});
                }else{
                    return NextResponse.json({ status: 200 , message: 'Watchlist was not saved.'});
                }
            }
        }else{
            await db.collection("Watchlist").deleteMany({ username, watchlist });
            return NextResponse.json({ status: 200, message: 'Watchlist has been deleted.'})
        }
        
    }catch(err){
        return NextResponse.json({err});
    }
}

export async function PATCH(req, res){
    try{
        const { username, watchlist } = await req.json();
        // console.log(username, secretKey, apiKey)

        const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
        
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
                return NextResponse.json({ status: 200, message: 'Watchlist has been updated.'});
            }else{
                return NextResponse.json({ status: 200 , message: 'Watchlist was not updated.'});
            }
        }  


    }catch(err){
        console.log(err)
        return NextResponse.json({ status: 500, message: err});
    }
}

export async function DELETE(req, res){
    try{
        const { username, watchlist } = await req.json();

        const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
    
    
        await db.collection("Watchlist").deleteMany({})
        return NextResponse.json({ status: 200, message: 'All Watchlist has been deleted.'})
        
      }catch(err){
        return NextResponse.json({ status: 500, message: "Error in deleting"})
      }
}