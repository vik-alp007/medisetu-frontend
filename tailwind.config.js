/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medisetu: {
          primary: "#1877F2",       // Main action blue (Next, Create Account, Book)
          "primary-hover": "#0E65D9",
          "primary-light": "#EBF3FE", // Selected tabs, light chips
          "primary-dark": "#0B4EAE",
          
          teal: "#00A896",          // Accent teal ("doctor", "appointments", "health")
          cyan: "#06B6D4",
          
          navy: "#0F172A",          // Primary dark heading color
          slate: "#334155",         // Body text
          muted: "#64748B",         // Subtext & label grey
          light: "#94A3B8",         // Muted secondary icons
          
          surface: "#FFFFFF",
          bg: "#F4F9FF",            // Light healthcare ambient background
          border: "#E2E8F0",
          "border-focus": "#93C5FD",

          // Status colors
          danger: "#EF4444",        // Emergency red, Ambulance CTA
          "danger-hover": "#DC2626",
          "danger-light": "#FEF2F2",
          "danger-badge": "#FEE2E2",
          
          success: "#10B981",       // Confirmed green check, paid tags
          "success-light": "#ECFDF5",
          
          warning: "#F59E0B",       // Rating stars
          "warning-light": "#FEF3C7",

          // Dashboard Quick Actions & Category Cards
          "pastel-blue": "#EFF6FF",
          "pastel-pink": "#FDF2F8",
          "pastel-cyan": "#ECFEFF",
          "pastel-green": "#F0FDF4",
          "pastel-peach": "#FFF7ED",
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(24, 119, 242, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 20px 35px -10px rgba(24, 119, 242, 0.15)",
        dock: "0 -4px 25px rgba(15, 23, 42, 0.06)",
        badge: "0 2px 8px rgba(24, 119, 242, 0.15)",
      }
    },
  },
  plugins: [],
}

