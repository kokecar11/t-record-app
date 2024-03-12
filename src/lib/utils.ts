import { type ClassValue, clsx } from "clsx"
import { isSameDay } from "date-fns";
import { twMerge } from "tailwind-merge"
import { type Live } from "~/app/_components/markers/marker-card";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(text:string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const validateMarker = (status:string, live:Live, streamDate:Date, isInit:boolean) => {
  const now = new Date(Date.now())

  if(!isSameDay(streamDate, now)) return true

  if (status === 'RECORDED') return true

  if (status === 'RECORDED' || live.status === 'offline' ) if (isInit) return true

  if (status === 'UNRECORDED' && live.status === 'live' ) return false

  if (live.status === 'offline') return true
  return false
}