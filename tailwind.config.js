module.exports = {
  content: [
    "./src/**/*.{ts,tsx,html}", // <== Update this
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          mods: {
            title: "#ffff77",
            fractured: "#a29162",
            enchanted: "#b4b4ff",
            regular: "#8888ff",
          },
        },
      },
    },
  },
  plugins: [],
};
