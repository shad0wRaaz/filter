import  dotenv  from 'dotenv'
dotenv.config();

export const API_URL = `https://${process.env.NEXT_PUBLIC_TS_API_URL}`;
export const authKey = 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_TS_API_KEY}:${process.env.NEXT_PUBLIC_TS_SECRET_KEY}`);

export const clientAuthKey = (apikey, secretkey) => {
    return ('Basic ' + btoa(`${apikey}:${secretkey}`));
}

export const processPromisesInBatchesWithDelay = async(promises, batchSize, delayInMilliseconds) => {
    for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);
        await Promise.all(batch);
        // Introduce a delay after each batch
        await delay(delayInMilliseconds);
    }
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}