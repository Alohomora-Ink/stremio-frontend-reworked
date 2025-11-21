/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  trailingComma: "none", // This is ignored by the JSON parser by default

  // Add an override specifically for .hintrc and potentially other json files
  overrides: [
    {
      files: ["*.json", "*.jsonc", ".hintrc"],
      options: {
        // Set a specific JSON-friendly option to ensure no commas are added
        trailingComma: "none",
      },
    },
  ],
};
