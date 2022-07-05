const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: "class",
  theme: {
    colors: {
      primary: "#4299E1",
      secondary: "#39BDF8",
      "nav-background": "#FFFFFF",
      background: "#F8F9FA",
      "secondary-background": "#DCF0FF",
      "txt-color": "#000000",
      "txt-secondary-color": "#64748b",
      "txt-hover-color": "#94a3b8",
      "background-dim": "rgb(0,0,0,0.5)",
      "dark-bg": "#161A23",
      "dark-bg-paper": "#252836",
      "dark-bg-linkHover": "#1C2633",
      "dark-bg-input": "#2D303E",
      "dark-border-primary": "#43454E",
      "dark-border-input": "#505261",
      "dark-txt-primary": "#ffffff",
      "dark-txt-secondary": "#9C9FB1",
      "dark-txt-link": "#8493A9",
      "dark-txt-input": "#CCCEDE",
      "dark-secondary-background": "#2E303E",
      ...colors,
    },

    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "850px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },

    extend: {
      backgroundImage: {
        blob: "url('./assets/blob.svg')",
      },

      keyframes: {
        slideRight: {
          from: {
            opacity: 0,
            transform: "translateX(-40px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0px) scale(1)",
          },
        },
        slideLeft: {
          from: {
            opacity: 0,
            transform: "translateX(40px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0px) scale(1)",
          },
        },
        roundIn: {
          from: {
            opacity: 0,
            transform: "rotate(0.5turn)",
          },
          to: {
            opacity: 1,
            transform: "rotate(0)",
          },
        },
        roundOut: {
          from: {
            opacity: 0,
            transform: "rotate(0turn)",
          },
          to: {
            opacity: 1,
            transform: "rotate(0.5)",
          },
        },
      },

      animation: {
        slideRight: "slideRight ease-in 0.3s",
        slideLeft: "slideLeft ease-in 0.3s",
        roundIn: "roundIn ease-in 0.3s",
        roundOut: "roundOut ease-in 0.3s",
      },
    },
  },
  plugins: [],
};
