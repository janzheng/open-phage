

// ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
// 	const { slug } = req.params;

// 	const article = await db.get(slug);

// 	if (article !== null) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify(article));
// 	} else {
// 		next();
// 	}
// }

import { sendData } from "../../_utils/sapper-helpers" 
import { config } from "dotenv"

const fetch = require("node-fetch")	
config(); // https://github.com/sveltejs/sapper/issues/122

let json;




export async function get(req, res) {

  try {

	  return sendData(process.env.STATUS, res, 200)

	} catch(err) {
		throw new Error('[api/status] Error', err)
	}
}


