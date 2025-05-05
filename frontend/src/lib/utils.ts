import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Converts a rating (1-5) to a descriptive label
 */
export function getRatingLabel(rating: number) {
  switch (rating) {
    case 1:
      return "Poor"
    case 2:
      return "Fair"
    case 3:
      return "Good"
    case 4:
      return "Very Good"
    case 5:
      return "Excellent"
    default:
      return "Unknown"
  }
}

/**
 * Converts approval status to a readable format with color
 */
export function getStatusInfo(status: string) {
  switch (status) {
    case "pending":
      return { label: "Pending", color: "text-amber-600", bgColor: "bg-amber-100" }
    case "approved":
      return { label: "Approved", color: "text-green-600", bgColor: "bg-green-100" }
    case "rejected":
      return { label: "Rejected", color: "text-red-600", bgColor: "bg-red-100" }
    default:
      return { label: "Unknown", color: "text-gray-600", bgColor: "bg-gray-100" }
  }
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string" && value.trim() === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === "object" && Object.keys(value).length === 0) return true
  return false
}

/**
 * Generates initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
