module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        base: "repeat(auto-fill, 125px)",
      },
      boxShadow: {
        header: "0 10px 15px 2px rgba(0, 0, 0, 0.8)",
        focus: "0 0 0 3px rgba(59, 130, 246, 0.5)",
        "focus-strong": "0 0 0 4px rgba(59, 130, 246, 0.8)",
      },
      colors: {
        focus: {
          ring: "#3B82F6",
          "ring-light": "#93C5FD",
          "ring-dark": "#1E40AF",
          highlight: "#FDE047",
        },
      },
      scale: {
        102: "1.02",
        103: "1.03",
        105: "1.05",
      },
      animation: {
        "focus-pulse": "focus-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "focus-ring": "focus-ring 0.3s ease-out",
        "focus-scale": "focus-scale 0.2s ease-out",
      },
      keyframes: {
        "focus-pulse": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.8,
          },
        },
        "focus-ring": {
          "0%": {
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
          },
          "100%": {
            boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5)",
          },
        },
        "focus-scale": {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1.02)",
          },
        },
      },
      borderWidth: {
        3: "3px",
      },
      ringWidth: {
        3: "3px",
        5: "5px",
      },
      ringOffsetWidth: {
        3: "3px",
      },
    },
    fontFamily: {
      sans: ["Do Hyeon", "sans-serif"],
      serif: ["Do Hyeon", "serif"],
    },
  },
  plugins: [],
};
