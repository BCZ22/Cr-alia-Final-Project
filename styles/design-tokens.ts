/**
 * Design Tokens for Créalia Project
 * 
 * This file centralizes all design-related constants, ensuring a consistent
 * look and feel across the entire application. It includes colors, fonts,
 * spacing, radii, and other stylistic properties.
 * 
 * Using design tokens helps in maintaining the UI, updating themes, and
 * ensuring that all components adhere to the established design system.
 */

export const colors = {
  primary: {
    DEFAULT: "hsl(262.1 83.3% 57.8%)", // A vibrant purple
    foreground: "hsl(0 0% 100%)",
    light: "hsl(262.1 83.3% 67.8%)",
    dark: "hsl(262.1 83.3% 47.8%)",
  },
  secondary: {
    DEFAULT: "hsl(222.2 47.4% 11.2%)", // A deep, cool gray
    foreground: "hsl(0 0% 98%)",
  },
  destructive: {
    DEFAULT: "hsl(0 72.2% 50.6%)",
    foreground: "hsl(0 0% 98%)",
  },
  muted: {
    DEFAULT: "hsl(210 40% 96.1%)",
    foreground: "hsl(215.4 16.3% 46.9%)",
  },
  accent: {
    DEFAULT: "hsl(142.1 76.2% 36.3%)", // A bright, energetic green
    foreground: "hsl(0 0% 98%)",
  },
  background: "hsl(0 0% 100%)",
  foreground: "hsl(222.2 47.4% 11.2%)",
  card: {
    DEFAULT: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 47.4% 11.2%)",
  },
  border: "hsl(214.3 31.8% 91.4%)",
  input: "hsl(214.3 31.8% 91.4%)",
  ring: "hsl(262.1 83.3% 57.8%)",
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
};

export const radii = {
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

export const typography = {
  fontFamily: {
    sans: ["Inter", "sans-serif"],
    serif: ["Georgia", "serif"],
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

const designTokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};

export default designTokens;
