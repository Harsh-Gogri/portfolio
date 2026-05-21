import { Geist, Instrument_Serif, Inter } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap"
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap"
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});
