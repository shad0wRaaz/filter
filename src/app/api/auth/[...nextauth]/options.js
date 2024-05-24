import { MY_API_URL } from "@/lib/utils";
import CredentialsProvider from "next-auth/providers/credentials";

const baseURL = MY_API_URL + "/user/login";

export const options = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
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
        console.log("Login...", resdata);
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
  callbacks: {
    async jwt({ token, user }) {
      // the user present here gets the same data as received
      // from DB call  made above -> fetchUserInfo(credentials.opt)
      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      // user param present in the session(function) does not recive 
      //all the data from DB call -> fetchUserInfo(credentials.opt)
      return token;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
};