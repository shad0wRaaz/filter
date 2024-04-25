import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const API_URL = `https://${process.env.NEXT_PUBLIC_TS_API_URL}`;

export const MY_API_URL = process.env.NODE_ENV == 'development' ? `http://localhost:3000/api` : 'http://localhost:3000/api';

export const authKey = (apiKey, secretKey) => {
  return ('Basic ' + btoa(`${apiKey}:${secretKey}`))
};

export const currencyFormat = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD" }).format(value)
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

export const timeAgo = (dateParam) => {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}