
import { connectToDatabase } from '../libs/mongodb/mongoClient.js';

const db = await connectToDatabase();

export const getWatchlistNames = async(email) => {
    let returnObject = "";
    try{
        const collection = db.collection("WatchlistNames");

        const returnObject = await collection.find({ email }).toArray();
        return returnObject;
    }catch(err){
        console.log("error", err)
        returnObject = err;
    }
    return returnObject;
}

export const saveWatchlistName = async(email, listname) => {
    try{
        // const db = await connectToDatabase();
        const collection = db.collection("WatchlistNames");
        
        const existingWatchlist = await collection.find({ email, listname }).toArray();

        if(existingWatchlist.length == 0){
            const item = await collection.insertOne({
                email, listname, createdAt: new Date()
            });
            if(item.acknowledged == true){
                if(item?.insertedId){
                    return ({ status: 200, message: 'Watchlist Item has been saved.'});
                }else{
                    return ({ status: 400 , message: 'Watchlist Item was not saved.'});
                }
            }
        }else{
            // await db.collection("Watchlist").deleteMany({ email, watchlistItem });
            return ({ status: 400, message: 'Watchlist already present.'});
        }
        
    }catch(err){
        return ({ status: 500, message: err});
    }
}

export const deleteWatchlistName = async(email, listname) => {
    try{
        const collection =  db.collection("WatchlistNames");
        const deleteResult = await collection.deleteOne({ email, listname });
        
        const watchlistCollection = db.collection("Watchlist");
        const deleteWatchlistResult = await watchlistCollection.deleteMany({ email, listname });

        return ({ status: 200, message: deleteResult.deletedCount === 1 ? 'deleted': 'failed'});
    }catch(err){
        return ({ status: 500, message: err})
    }
}

export const getWatchlist = async(email) => {
    let returnObject = "";
    try{
        const collection = db.collection("Watchlist");

        const returnObject = await collection.find({ email }).toArray();
        return returnObject;
    }catch(err){
        console.log("error", err)
        returnObject = err;
    }
    return returnObject;
}

export const saveWatchlist = async(email, watchlist, listname) => {
    try{
        // const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
        
        const existingWatchlist = await collection.find({ email, watchlist, listname }).toArray();

        if(existingWatchlist.length == 0){
            const item = await collection.insertOne({
                email, watchlist, listname, createdAt: new Date()
            });
            if(item.acknowledged == true){
                if(item?.insertedId){
                    return ({ status: 200, message: 'saved', description: `Account added to ${listname}`});
                }else{
                    return ({ status: 400 , message: 'failed', description: 'Account not added.'});
                }
            }
        }else{
            await db.collection("Watchlist").deleteMany({ email, watchlist, listname });
            return ({ status: 200, message: 'deleted', description: `Account removed from ${listname}`});
        }
        
    }catch(err){
        return ({ status: 500, message: err});
    }
}

export async function PATCH(req, res){
    try{
        const { email, watchlist } = await req.json();
        // console.log(username, secretKey, apiKey)

        // const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
        
        const item = await collection.updateOne(
           { email }, 
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
        const { email, watchlist } = await req.json();

        // const db = await connectToDatabase();
        const collection = db.collection("Watchlist");
    
    
        await db.collection("Watchlist").deleteMany({})
        return NextResponse.json({ status: 200, message: 'All Watchlist has been deleted.'})
        
      }catch(err){
        return NextResponse.json({ status: 500, message: "Error in deleting"})
      }
}