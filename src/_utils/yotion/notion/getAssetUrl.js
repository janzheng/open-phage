
const { config } = require("dotenv");
config(); // https://github.com/sveltejs/sapper/issues/122


module.exports = (url, blockId) => {
  // const BASE = process.env.NODE_ENV === "development" ? "http://localhost:2024" : process.env.NOTION_ASSET_URL
  const BASE = process.env.NOTION_ASSET_URL
  return `${BASE}?url=${encodeURIComponent(url)}&blockId=${blockId}`
}