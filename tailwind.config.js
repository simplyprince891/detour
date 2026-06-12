// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E90FF",
        background: "#0A0F1E",
        highlight: "#00D4FF",
        card: "#111827",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Barlow Condensed", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
      },
    },
  },
  plugins: [],
};
