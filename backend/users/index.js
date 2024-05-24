import { connectToDatabase } from '../libs/mongodb/mongoClient.js';
import { encryptData } from '../libs/security/crypt.js';

const db = await connectToDatabase();

export const getUser = async(email, password) => {
    if(!email || !password) return false;

    try{
        const userCollection = db.collection("Users");
        const user = await userCollection.findOne({ email });
        
        if(!user) return false;

        if(user.password == encryptData(password)){
            return ({
                ...user,
                password: undefined
            })
        }
        return false;
        
    }catch(err){
        console.log("error while getting user: ", err);
        return false;
    }
}

export const registerUser = async(username, password) => {

}