module.exports = {
  content: [
    "./src/**/*.{ts,tsx,html}", // <== Update this
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          mods: {
            fractured: "#a29162",
            rare: "#ffff77",

            unique: "#AF6025",
            enchanted: "#b4b4ff",
            regular: "#8888ff",
          },
        },
      },
    },
  },
  plugins: [],
};
