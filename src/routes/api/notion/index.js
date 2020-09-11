

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

import send from '@polka/send';
import Cytosis from 'cytosis';
import * as sapper from '@sapper/server';
import base from "../../../_content/notion"
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"

import { config } from "dotenv";

const fetch = require("node-fetch")	
config(); // https://github.com/sveltejs/sapper/issues/122

let json;



// gets a yotion 'id' object
// large objects will time out
export const getId = async (id) => {
	const _cacheStr = `yotion-${id}`
	if(cacheGet(_cacheStr))
		return cacheGet(_cacheStr)

	try {
	  const data = await fetch(`https://potion-fomo.vercel.app/id/${id}`)
	  const json = await data.json()
		cacheSet(_cacheStr, json)
	  return json
	} catch(e) {
		console.error('[getBase] error:', e)
	}
}




// this is done by the content loader now
// since the API isn't able to get all this data during runtime

// gets a yotion 'id' objectexport const getBase = async (id) => {

export const getBase = async (collection, content) => {
	try {

		if(collection)
			return base[collection]

		if(content)
			return base.content[content]

	  return base
	} catch(e) {
		console.error('[getBase] error:', e)
	}
}





export async function get(req, res) {

	const {collection, content} = req.query
  let json, base

	try {
		// json = await getBase(process.env.NOTION_BASE)
		base = await getBase(collection, content)
		// base = await buildBase(json)

		json = JSON.stringify(base)
		send(res, 200, json, {
			'Content-Type': 'application/json'
		});
	} catch(err) {
		throw new Error('[notion/get] Error', err)
	}
}


