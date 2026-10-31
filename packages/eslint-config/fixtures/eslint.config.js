import webstack from "../src/index.js"

export default webstack({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: { tsconfigRootDir: import.meta.dirname },
  },
})
