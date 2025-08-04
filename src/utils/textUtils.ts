/**
 * Text formatting utilities for consistent UI text handling
 */

/**
 * Converts a string to proper noun case (Title Case)
 * Handles edge cases like multiple spaces, special characters, and common abbreviations
 *
 * @param text - The input string to format
 * @returns The properly formatted string in Title Case
 *
 * Examples:
 * - "john doe" -> "John Doe"
 * - "mary jane smith" -> "Mary Jane Smith"
 * - "rkk" -> "Rkk"
 * - "user account" -> "User Account"
 */
export const toProperNounCase = (text: string): string => {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  // Handle common abbreviations and special cases
  const abbreviations = [
    "ai",
    "api",
    "ui",
    "ux",
    "cto",
    "ceo",
    "cfo",
    "hr",
    "it",
  ];

  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => {
      // Handle abbreviations (keep them uppercase if they're common)
      if (abbreviations.includes(word.toLowerCase())) {
        return word.toUpperCase();
      }

      // Handle single letters or very short words (like initials)
      if (word.length <= 2 && /^[a-zA-Z]+$/.test(word)) {
        return word.toUpperCase();
      }

      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

/**
 * Formats a display name with proper noun case
 * Handles fallback to "User" if no name is provided
 *
 * @param username - The username to format
 * @param fallback - The fallback text if username is empty (default: "User")
 * @returns The properly formatted display name
 */
export const formatDisplayName = (
  username?: string,
  fallback: string = "User"
): string => {
  if (!username || username.trim() === "") {
    return toProperNounCase(fallback);
  }

  return toProperNounCase(username.trim());
};

/**
 * Formats user account text consistently
 *
 * @param email - The user's email
 * @param fallback - The fallback text if email is empty (default: "User Account")
 * @returns The formatted account text
 */
export const formatAccountText = (
  email?: string,
  fallback: string = "User Account"
): string => {
  if (!email || email.trim() === "") {
    return fallback;
  }

  return email.trim();
};

/**
 * Creates a greeting text with proper formatting
 * Consistent greeting format across the application
 *
 * @param displayName - The user's display name
 * @returns The formatted greeting text
 *
 * Examples:
 * - createGreeting("John Doe") -> "Hi, John Doe"
 * - createGreeting("Rkk") -> "Hi, Rkk"
 */
export const createGreeting = (displayName: string): string => {
  return `Hi, ${displayName}`;
};
