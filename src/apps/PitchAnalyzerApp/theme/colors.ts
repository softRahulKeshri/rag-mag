// Brand Color Palette for PitchAnalyzerApp
// This file provides TypeScript types and utility functions for consistent color usage

export const BrandColors = {
  // Brand Gradient Colors
  gradient: {
    orange: "#FDA052",
    purple: "#B96AF7",
    blue: "#3077F3",
    cyan: "#41E6F8",
  },

  // Primary Colors
  primary: {
    charcoalSlate: "#2E3141",
  },

  // Neutral Palette
  neutral: {
    black: "#050507",
    n3000: "#171921",
    n2000: "#20222E",
    n1000: "#2E3141",
    n900: "#434654",
    n800: "#585A67",
    n700: "#6D6F7A",
    n600: "#82838D",
    n500: "#9698A0",
    n400: "#ABADB3",
    n300: "#C0C1C6",
    n200: "#D5D6D9",
    n150: "#EAEAEC",
    n100: "#F5F5F5",
    white: "#FFFFFF",
  },

  // Absolute Greyscale
  greyscale: {
    black: "#070707",
    g3000: "#212121",
    g2000: "#2E2E2E",
    g1000: "#414141",
    g900: "#545454",
    g800: "#676767",
    g700: "#7A7A7A",
    g600: "#8D8D8D",
    g500: "#A0A0A0",
    g400: "#B3B3B3",
    g300: "#C6C6C6",
    g200: "#D9D9D9",
    g150: "#ECECEC",
    g100: "#F5F5F5",
    white: "#FFFFFF",
  },

  // Primary UI Blue
  uiBlue: {
    p700: "#11397E",
    p600: "#1E50A8",
    p500: "#3077F3",
    p400: "#94BAFD",
    p300: "#BFD6FF",
    p200: "#E3EDFF",
    p100: "#EFF5FF",
  },
} as const;

// TypeScript types for type safety
export type BrandGradientColor = keyof typeof BrandColors.gradient;
export type NeutralColor = keyof typeof BrandColors.neutral;
export type UIBlueColor = keyof typeof BrandColors.uiBlue;

// Common color combinations for different UI states
export const ColorSchemes = {
  // Primary button colors
  primary: {
    background: BrandColors.uiBlue.p500,
    hover: BrandColors.uiBlue.p600,
    active: BrandColors.uiBlue.p700,
    text: BrandColors.neutral.white,
  },

  // Secondary button colors
  secondary: {
    background: BrandColors.neutral.n200,
    hover: BrandColors.neutral.n300,
    active: BrandColors.neutral.n400,
    text: BrandColors.neutral.n900,
  },

  // Success state colors
  success: {
    background: "#10B981", // Green-500
    text: BrandColors.neutral.white,
    border: "#059669", // Green-600
  },

  // Error state colors
  error: {
    background: "#EF4444", // Red-500
    text: BrandColors.neutral.white,
    border: "#DC2626", // Red-600
  },

  // Warning state colors
  warning: {
    background: BrandColors.gradient.orange,
    text: BrandColors.neutral.n900,
    border: "#F59E0B", // Amber-500
  },

  // Info state colors
  info: {
    background: BrandColors.gradient.cyan,
    text: BrandColors.neutral.n900,
    border: BrandColors.gradient.blue,
  },
} as const;

// Gradient utilities
export const Gradients = {
  // Brand gradient combinations
  brand: {
    orangeToPurple:
      "bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple",
    purpleToBlue:
      "bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue",
    blueToCyan:
      "bg-gradient-to-r from-brand-gradient-blue to-brand-gradient-cyan",
    orangeToCyan:
      "bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-cyan",
    full: "bg-gradient-to-r from-brand-gradient-orange via-brand-gradient-purple via-brand-gradient-blue to-brand-gradient-cyan",
  },

  // UI Blue gradients
  uiBlue: {
    light: "bg-gradient-to-r from-primary-ui-blue-p100 to-primary-ui-blue-p200",
    medium:
      "bg-gradient-to-r from-primary-ui-blue-p200 to-primary-ui-blue-p300",
    strong:
      "bg-gradient-to-r from-primary-ui-blue-p400 to-primary-ui-blue-p500",
    dark: "bg-gradient-to-r from-primary-ui-blue-p500 to-primary-ui-blue-p600",
  },

  // Neutral gradients
  neutral: {
    light: "bg-gradient-to-r from-neutral-n100 to-neutral-n150",
    medium: "bg-gradient-to-r from-neutral-n200 to-neutral-n300",
    dark: "bg-gradient-to-r from-neutral-n800 to-neutral-n900",
  },
} as const;

// Common component color schemes
export const ComponentColors = {
  // Card colors
  card: {
    background: BrandColors.neutral.white,
    border: BrandColors.neutral.n200,
    shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    hoverShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },

  // Button colors
  button: {
    primary: {
      background: BrandColors.uiBlue.p500,
      hover: BrandColors.uiBlue.p600,
      text: BrandColors.neutral.white,
      border: BrandColors.uiBlue.p500,
    },
    secondary: {
      background: BrandColors.neutral.n100,
      hover: BrandColors.neutral.n200,
      text: BrandColors.neutral.n900,
      border: BrandColors.neutral.n300,
    },
    outline: {
      background: "transparent",
      hover: BrandColors.neutral.n100,
      text: BrandColors.neutral.n700,
      border: BrandColors.neutral.n300,
    },
  },

  // Input colors
  input: {
    background: BrandColors.neutral.white,
    border: BrandColors.neutral.n300,
    focus: {
      border: BrandColors.uiBlue.p500,
      ring: BrandColors.uiBlue.p100,
    },
    placeholder: BrandColors.neutral.n500,
  },

  // Text colors
  text: {
    primary: BrandColors.neutral.n900,
    secondary: BrandColors.neutral.n700,
    tertiary: BrandColors.neutral.n500,
    inverse: BrandColors.neutral.white,
    brand: BrandColors.uiBlue.p500,
  },
} as const;
