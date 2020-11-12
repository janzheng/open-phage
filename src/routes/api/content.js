

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
import { cacheGet, cacheSet, cacheClear } from "../../_utils/cache"

import { config } from "dotenv";

import cytosis from "../../../static/data/cytosis.json"



config(); // https://github.com/sveltejs/sapper/issues/122
let json;

// const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
// const apiEditorKey = process.env.OPENPHAGE_AIRTABLE_PUBLIC_API
// const baseId = process.env.OPENPHAGE_AIRTABLE_PUBLIC_BASE

export async function get(req, res) {

	try {

		const _cacheStr = `cytosis`
		let _cache = cacheGet(_cacheStr)
		if(_cache) {
			send(res, 200, _cache, {
				'Content-Type': 'application/json'
			})
			return
		}

		// cytosis content grabbed at compile time from loader
		if(cytosis && cytosis.results['Content']) {
			let content = JSON.stringify(cytosis.results['Content'])
			cacheSet(_cacheStr, content)
			send(res, 200, content, {
				'Content-Type': 'application/json'
			})
			return
		}

	} catch(err) {
		throw new Error('[content/get] Error', err)
	}
}


