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

export const dateDifference = (olddate) => {
    let date1 = new Date(olddate);
    let date2 = new Date();
    
    // Calculating the time difference
    // of two dates
    let Difference_In_Time =
        date2.getTime() - date1.getTime();
    
    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    return Difference_In_Days;
  }