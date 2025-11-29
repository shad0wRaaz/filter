import { connectToDatabase } from "@/lib/mongoClient";
import { MY_API_URL } from "@/lib/utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, signOut } from "next-auth/react";

const baseURL = MY_API_URL + "/user/login";
const MAX_SESSION_IDLE_TIME = 15 * 60 * 1000; // 10 minutes in milliseconds

export const options = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where  retrieving user data
        // to verify with credentials
        const requestBody = {
          email: credentials.email,
          password: credentials.password,
        };
        const res = await fetch(baseURL, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: { "Content-Type": "application/json" },
        });
        const resdata = await res.json();

        if (
          resdata.status === 400 ||
          resdata.status === 401 ||
          resdata.status === 403 ||
          resdata.status === 500
        ) {
          return null;
        }
        if (resdata.status === 200 || resdata.status === 201) {
          return resdata;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    // signIn: "/",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  events: {
    signIn: async(message) => { 
      const { user, account, profile, isNewUser } = message;
      try{
        if(user){
          const client = await connectToDatabase();
          const collection = await client.collection("Sessions");
          const existingUser = await collection.findOne({email: user.data.email});

          if(!existingUser){
            await collection.insertOne({
              email: user.data.email,
              lastActivity: Date.now()
            })
          }else{
            await collection.updateOne({
              email: user.data.email
            },{
              $set: {
                lastActivity: Date.now()
              }
            })
          }
        }

      }catch(err){
        console.error("Error in updating database", err)
      }
    },
    signOut: async({token}) => {
      try{
        const client = await connectToDatabase();
        const collection = await client.collection("Sessions");
        await collection.updateOne({ email: token.data.email}, {
          $set: {
            lastActivity: ''
          }
        })
      }catch(err){
        console.error("Error in updating session in database", err);
      }
    },

  },
  callbacks: {
    async jwt({ token, user }) {
      // the user present here gets the same data as received
      // from DB call  made above -> fetchUserInfo(credentials.opt)
      const currentTime = Math.floor(Date.now() / 1000);
      if(!token.lastActivity){
        token.lastActivity = currentTime;
      }else if(token.lastActivity && currentTime - token.lastActivity > MAX_SESSION_IDLE_TIME){
        try{
          const client = await connectToDatabase();
          const collection = await client.collection("Sessions");
          await collection.updateOne({ email: token.data.email}, {
            $set: {
              lastActivity: ''
            }
          });
          console.log("timeout session")
        }catch(err){
          console.error("Error in updating session in database");
        }
        token.expired = true
      }else{
        token.lastActivity = currentTime;
      }
      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      // user param present in the session(function) does not recive 
      //all the data from DB call -> fetchUserInfo(credentials.opt)
console.log(token)
      if(!token.lastActivity){
        return null;
      }
      return token;
    },
  },
  // secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
};