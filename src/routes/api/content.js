

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

import * as Sentry from '@sentry/node';


import send from '@polka/send';
import Cytosis from 'cytosis';
import * as sapper from '@sapper/server';
import { cacheGet, cacheSet, cacheClear } from "../../_utils/cache"
import { getCytosis } from "../../_utils/get-cytosis"
import { sendData } from "../../_utils/sapper-helpers" 
import { _tr, _err, _msg } from '@/_utils/sentry'

import { config } from "dotenv";

let cytosis
try {
	cytosis = require('../../../static/data/cytosis.json')
} catch(err) {
	// do nothing if file doesn't exist
	_err(err)
}



config(); // https://github.com/sveltejs/sapper/issues/122
let useContentCache = !process.env.CYTOSIS_LIVE

// const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
// const apiEditorKey = process.env.OPENPHAGE_AIRTABLE_PUBLIC_API
// const baseId = process.env.OPENPHAGE_AIRTABLE_PUBLIC_BASE

export async function get(req, res) {

	let content = {}


	try {
		// const _cacheStr = `cytosis`
		// let _cache = cacheGet(_cacheStr)
		// if(_cache) {
		// 	send(res, 200, _cache, {
		// 		'Content-Type': 'application/json'
		// 	})
		// 	return
		// }

		// Sentry.init({
		// 	dsn: "https://e047cf154736481e91bb7616bdfcf36a@o460110.ingest.sentry.io/5522792",

		// 	// We recommend adjusting this value in production, or using tracesSampler
		// 	// for finer control
		// 	tracesSampleRate: 1.0,
		// });
	  // Sentry.captureMessage('????')

	
		// cytosis content grabbed at compile time from loader
		if(useContentCache && cytosis && cytosis.results['Content']) {
			content = cytosis.results['Content']
		} else {
			let _cytosis = await getCytosis({})
			content = _cytosis.results['Content']
		}

		// console.log('[content]:', content)
		// cacheSet(_cacheStr, content)
		return sendData(content, res, 200)
		
		
	} catch(err) {
		// throw new Error('[content/get] Error', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}


