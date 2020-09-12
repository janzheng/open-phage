/* Get signed asset URL for Notion S3 files */

const call = require("../notion/call")
const send = require('@polka/send');

module.exports = async (req, res) => {
  const { url, blockId } = req.query

  if(!url) {

    return send(res, 200, JSON.stringify({
      error: "No asset URL provided."
    }), {
      'Content-Type': 'application/json'
    });
  }

  if(!blockId) {

    send(res, 200, JSON.stringify({
      error: "No block ID provided."
    }), {
      'Content-Type': 'application/json'
    });
  }

  const assetRes = await call("getSignedFileUrls", {
    urls: [
      {
        url,
        permissionRecord: {
          table: "block",
          id: blockId
        }
      }
    ]
  })

  
  // res.status(307)
  // res.setHeader("location", assetRes.signedUrls[0])
  // res.end()


  send(res, 307, undefined, {
    "location": assetRes.signedUrls[0]
  });
}