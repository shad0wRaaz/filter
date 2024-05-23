
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';

// let client;
// const clientPromise = MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then((client) => {
//   client = client;
//   return client;
// });

export const authOptions = () => {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req){
        return null;
      }
    })
  ]
}