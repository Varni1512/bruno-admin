import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEmptyHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent?.trim() === "";
};