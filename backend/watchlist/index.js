
import { connectToDatabase } from '../libs/mongodb/mongoClient.js';


export const getWatchlist = async(username) => {
    let returnObject = "";
    try{
        const db = await connectToDatabase();
        const collection = db.collection("Watchlist");

        const returnObject = await collection.find({ username }).toArray();

        return returnObject;
    }catch(err){
        console.log("error", err)
        returnObject = err;
    }
    return returnObject;
}

export const saveWatchlist = async(username, watchlist) => {
    try{
        const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
        
        const existingWatchlist = await collection.find({ username, watchlist }).toArray();

        if(existingWatchlist.length == 0){
            const item = await collection.insertOne({
                username, watchlist, createdAt: new Date()
            });
            if(item.acknowledged == true){
                if(item?.insertedId){
                    return ({ status: 200, message: 'Watchlist has been saved.'});
                }else{
                    return ({ status: 200 , message: 'Watchlist was not saved.'});
                }
            }
        }else{
            await db.collection("Watchlist").deleteMany({ username, watchlist });
            return ({ status: 200, message: 'Watchlist has been deleted.'});
        }
        
    }catch(err){
        return ({ status: 500, message: err});
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