/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: false,
  singleQuote: true,
  bracketSameLine: true,
  tabWidth: 2,
  useTabs: true,
};

export default config;
