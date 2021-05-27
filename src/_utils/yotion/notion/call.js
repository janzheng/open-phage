/* Call a method on Notion's API */

// const fetch = require("node-fetch")
const fetch = require("node-fetch-retry")

module.exports = (methodName, body) => new Promise(resolve => {
  try {
    fetch(`https://www.notion.so/api/v3/${methodName}`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      timeout: 0, // 9000 — 0 means no timeout
      body: JSON.stringify(body),

      // node-fetch-retry
      pause: 5000,
      retry: 10,
      callback: retry => { console.log(`[call.js] Trying: ${retry}`) }
    })
      .then(async res => {
        try {
          const body = await res.text()
          return JSON.parse(body)
          // return res.json()
        } catch (e) {
          console.error("[call.js] not json:", e)
          console.error("[call.js] body:", body)
          return null
        }
      })
      .then(json => resolve(json))
  } catch(error) {
    console.error('[call.js error]:', methodName, body)
  }
})


