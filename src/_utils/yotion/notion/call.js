/* Call a method on Notion's API */

const fetch = require("node-fetch")

module.exports = (methodName, body) => new Promise(resolve => {
  fetch(`https://www.notion.so/api/v3/${methodName}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    timeout: 0, // 9000 — 0 means no timeout
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(json => resolve(json))
})


