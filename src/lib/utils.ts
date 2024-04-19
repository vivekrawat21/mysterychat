import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Tailwind merge is a utility function that merges tailwind classes together 
//shadcn is not a component library .it's a collection of reusable components tht we can copy and paste into the apps.