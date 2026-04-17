import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatters: Record<string, Intl.NumberFormat> = {};
const pointsFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number, currency: string = "USD") {
  if (!currencyFormatters[currency]) {
    currencyFormatters[currency] = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });
  }
  return currencyFormatters[currency].format(value);
}

export function formatPoints(points: number) {
  return pointsFormatter.format(points);
}
