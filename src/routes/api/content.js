

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

import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

import cytosis from "../../../static/cytosis.json"



config(); // https://github.com/sveltejs/sapper/issues/122


let json;

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.OPENPHAGE_AIRTABLE_PUBLIC_API
const baseId = process.env.OPENPHAGE_AIRTABLE_PUBLIC_BASE









export async function get(req, res) {

	// console.log('get request')
	try {

		// const cacheStr = `${view}-seminars`
	 //  const cache = nodecache.get( cacheStr )
	 //  if(cache) {
	 //  	// console.log('[cytosis] seminar cache')
		// 	json = JSON.stringify(cache)
		// 	send(res, 200, json, {
		// 		'Content-Type': 'application/json'
		// 	})
		// 	return
	 //  }


		const _cacheStr = `cytosis`
		let _cache = cacheGet(_cacheStr)
		if(_cache) {
			send(res, 200, _cache, {
				'Content-Type': 'application/json'
			})
			return
		}










	  let bases = [{
		  tables: ["Content", "SyncView"],
		  options: {
		    "view": view,
		  }
	  }
	  ]

		// console.log('loading cytosis...', bases)
	  let _cytosis = await new Cytosis({
	    apiKey: apiEditorKey,
	    baseId: baseId,
	    bases: 	bases,
	    routeDetails: '[content/get]',
	  })

	  console.log('_cytosis:::', _cytosis)











		// cached cytosis
		if(cytosis) {
			let _cytosis = JSON.stringify(cytosis)
			cacheSet(_cacheStr, _cytosis)
			send(res, 200, _cytosis, {
				'Content-Type': 'application/json'
			})
			return
		}


	 //  _cytosis.then((_result) => {

	 //  	delete _result['apiKey']
	 //  	delete _result['baseId']


  //     // nodecache.set( cacheStr, _result, 60*60 );

  //     // console.log('results:::', _result.results.Schedule[0])
		// 	json = JSON.stringify(_result)
		// 	send(res, 200, json, {
		// 		'Content-Type': 'application/json'
		// 	});
	 //  })
	} catch(err) {
		throw new Error('[content/get] Error', err)
	}
}


