// Brand Color Palette for ResumeParserApp
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
export type GreyscaleColor = keyof typeof BrandColors.greyscale;
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

// Tailwind CSS class mappings for easy usage
export const TailwindColorClasses = {
  // Background colors
  bg: {
    brandOrange: "bg-brand-gradient-orange",
    brandPurple: "bg-brand-gradient-purple",
    brandBlue: "bg-brand-gradient-blue",
    brandCyan: "bg-brand-gradient-cyan",
    primarySlate: "bg-primary-charcoal-slate",
    uiBlue500: "bg-primary-ui-blue-p500",
    uiBlue400: "bg-primary-ui-blue-p400",
    uiBlue300: "bg-primary-ui-blue-p300",
    uiBlue200: "bg-primary-ui-blue-p200",
    uiBlue100: "bg-primary-ui-blue-p100",
    neutral100: "bg-neutral-n100",
    neutral150: "bg-neutral-n150",
    neutral200: "bg-neutral-n200",
    neutral300: "bg-neutral-n300",
    neutral400: "bg-neutral-n400",
    neutral500: "bg-neutral-n500",
    neutral600: "bg-neutral-n600",
    neutral700: "bg-neutral-n700",
    neutral800: "bg-neutral-n800",
    neutral900: "bg-neutral-n900",
    neutral1000: "bg-neutral-n1000",
    neutral2000: "bg-neutral-n2000",
    neutral3000: "bg-neutral-n3000",
    neutralBlack: "bg-neutral-n-black",
    neutralWhite: "bg-neutral-n-white",
  },

  // Text colors
  text: {
    brandOrange: "text-brand-gradient-orange",
    brandPurple: "text-brand-gradient-purple",
    brandBlue: "text-brand-gradient-blue",
    brandCyan: "text-brand-gradient-cyan",
    primarySlate: "text-primary-charcoal-slate",
    uiBlue500: "text-primary-ui-blue-p500",
    uiBlue600: "text-primary-ui-blue-p600",
    uiBlue700: "text-primary-ui-blue-p700",
    neutral100: "text-neutral-n100",
    neutral200: "text-neutral-n200",
    neutral300: "text-neutral-n300",
    neutral400: "text-neutral-n400",
    neutral500: "text-neutral-n500",
    neutral600: "text-neutral-n600",
    neutral700: "text-neutral-n700",
    neutral800: "text-neutral-n800",
    neutral900: "text-neutral-n900",
    neutral1000: "text-neutral-n1000",
    neutralBlack: "text-neutral-n-black",
    neutralWhite: "text-neutral-n-white",
  },

  // Border colors
  border: {
    brandOrange: "border-brand-gradient-orange",
    brandPurple: "border-brand-gradient-purple",
    brandBlue: "border-brand-gradient-blue",
    brandCyan: "border-brand-gradient-cyan",
    primarySlate: "border-primary-charcoal-slate",
    uiBlue500: "border-primary-ui-blue-p500",
    uiBlue400: "border-primary-ui-blue-p400",
    uiBlue300: "border-primary-ui-blue-p300",
    uiBlue200: "border-primary-ui-blue-p200",
    uiBlue100: "border-primary-ui-blue-p100",
    neutral100: "border-neutral-n100",
    neutral150: "border-neutral-n150",
    neutral200: "border-neutral-n200",
    neutral300: "border-neutral-n300",
    neutral400: "border-neutral-n400",
    neutral500: "border-neutral-n500",
    neutral600: "border-neutral-n600",
    neutral700: "border-neutral-n700",
    neutral800: "border-neutral-n800",
    neutral900: "border-neutral-n900",
    neutral1000: "border-neutral-n1000",
  },

  // Focus ring colors
  focus: {
    brandBlue: "focus:ring-brand-gradient-blue",
    uiBlue500: "focus:ring-primary-ui-blue-p500",
    uiBlue400: "focus:ring-primary-ui-blue-p400",
  },

  // Hover states
  hover: {
    bg: {
      brandOrange: "hover:bg-brand-gradient-orange",
      brandPurple: "hover:bg-brand-gradient-purple",
      brandBlue: "hover:bg-brand-gradient-blue",
      brandCyan: "hover:bg-brand-gradient-cyan",
      uiBlue100: "hover:bg-primary-ui-blue-p100",
      uiBlue200: "hover:bg-primary-ui-blue-p200",
      uiBlue300: "hover:bg-primary-ui-blue-p300",
      uiBlue400: "hover:bg-primary-ui-blue-p400",
      uiBlue500: "hover:bg-primary-ui-blue-p500",
      uiBlue600: "hover:bg-primary-ui-blue-p600",
      uiBlue700: "hover:bg-primary-ui-blue-p700",
      neutral100: "hover:bg-neutral-n100",
      neutral150: "hover:bg-neutral-n150",
      neutral200: "hover:bg-neutral-n200",
      neutral300: "hover:bg-neutral-n300",
    },
    text: {
      brandOrange: "hover:text-brand-gradient-orange",
      brandPurple: "hover:text-brand-gradient-purple",
      brandBlue: "hover:text-brand-gradient-blue",
      brandCyan: "hover:text-brand-gradient-cyan",
      uiBlue500: "hover:text-primary-ui-blue-p500",
      uiBlue600: "hover:text-primary-ui-blue-p600",
      neutral900: "hover:text-neutral-n900",
      neutral800: "hover:text-neutral-n800",
      neutral700: "hover:text-neutral-n700",
      neutralWhite: "hover:text-neutral-n-white",
    },
    border: {
      brandOrange: "hover:border-brand-gradient-orange",
      brandPurple: "hover:border-brand-gradient-purple",
      brandBlue: "hover:border-brand-gradient-blue",
      brandCyan: "hover:border-brand-gradient-cyan",
      uiBlue500: "hover:border-primary-ui-blue-p500",
      uiBlue400: "hover:border-primary-ui-blue-p400",
      neutral300: "hover:border-neutral-n300",
      neutral400: "hover:border-neutral-n400",
      neutral500: "hover:border-neutral-n500",
    },
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
  // Button variants
  button: {
    primary: `${TailwindColorClasses.bg.uiBlue500} ${TailwindColorClasses.text.neutralWhite} ${TailwindColorClasses.hover.bg.uiBlue600}`,
    secondary: `${TailwindColorClasses.bg.neutral200} ${TailwindColorClasses.text.neutral900} ${TailwindColorClasses.hover.bg.neutral300}`,
    outline: `${TailwindColorClasses.border.uiBlue500} ${TailwindColorClasses.text.uiBlue500} ${TailwindColorClasses.hover.bg.uiBlue500} ${TailwindColorClasses.hover.text.neutralWhite}`,
    ghost: `${TailwindColorClasses.text.uiBlue500} ${TailwindColorClasses.hover.bg.uiBlue100}`,
  },

  // Card variants
  card: {
    default: `${TailwindColorClasses.bg.neutralWhite} ${TailwindColorClasses.border.neutral200}`,
    elevated: `${TailwindColorClasses.bg.neutralWhite} ${TailwindColorClasses.border.neutral300} shadow-lg`,
    interactive: `${TailwindColorClasses.bg.neutralWhite} ${TailwindColorClasses.border.neutral200} ${TailwindColorClasses.hover.border.neutral300} ${TailwindColorClasses.hover.bg.neutral100}`,
  },

  // Input variants
  input: {
    default: `${TailwindColorClasses.border.neutral300} ${TailwindColorClasses.focus.brandBlue} ${TailwindColorClasses.hover.border.neutral400}`,
    error: "border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:ring-green-500",
  },

  // Status indicators
  status: {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: `${TailwindColorClasses.bg.brandOrange} ${TailwindColorClasses.text.neutralBlack} border-amber-200`,
    info: `${TailwindColorClasses.bg.brandCyan} ${TailwindColorClasses.text.neutralBlack} ${TailwindColorClasses.border.brandBlue}`,
  },
} as const;

export default BrandColors;
