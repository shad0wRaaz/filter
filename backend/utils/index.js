import  dotenv  from 'dotenv'
dotenv.config();

export const API_URL = `https://${process.env.NEXT_PUBLIC_TS_API_URL}`;
export const authKey = 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_TS_API_KEY}:${process.env.NEXT_PUBLIC_TS_SECRET_KEY}`);

export const clientAuthKey = (apikey, secretkey) => {
    return ('Basic ' + btoa(`${apikey}:${secretkey}`));
}