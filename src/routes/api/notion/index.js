

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
import base from "../../../../static/notion.json"
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"

import { config } from "dotenv";

const fetch = require("node-fetch")	
config(); // https://github.com/sveltejs/sapper/issues/122

let json;



// gets a yotion 'id' object
// large objects will time out
export const getId = async (id) => {
	// const _cacheStr = `yotion-${id}`
	// if(cacheGet(_cacheStr))
	// 	return cacheGet(_cacheStr)

	try {
	  const data = await fetch(`https://potion-fomo.vercel.app/id/${id}`)
	  const json = await data.json()
		// cacheSet(_cacheStr, json)
	  return json
	} catch(e) {
		console.error('[getBase] error:', e)
	}
}




// this is done by the content loader now
// since the API isn't able to get all this data during runtime

// gets a yotion 'id' objectexport const getBase = async (id) => {

export const getBase = ({collection, content, getField}) => {
	try {

		let _base // load base into cache
		const _cacheStr = `base`
		const _cache = cacheGet(_cacheStr)
		if(_cache)
			 _base = _cache
		else {
			_base = base
			cacheSet(_cacheStr, _base)
		}




		if(collection)
			return _base[collection]

		if(content) {
			return _base.content[content]
		}

		if(getField) {
			let dataArr = []
			// data[getField[0]] = []

			console.log('getField:', getField)
			Object.keys(_base.content).map(contentItem => {
				_base.content[contentItem].map(item => {
					if(item.fields[getField[0]] == getField[1]) {
						// data[getField[0]].push(item)
						dataArr.push(item)
					}
				})
			})
			return dataArr
		}

	  return _base
	} catch(e) {
		console.error('[getBase] error:', e)
	}
}





export async function get(req, res) {

	const {id, collection, collections, content, contents, getField, fields} = req.query
  let json, base = {}

	try {
		if(id) {
			// json = await getBase(process.env.NOTION_BASE)
			base = await getId(id)
			// base = await buildBase(json)
		}

		if(collection) {
			// json = await getBase(process.env.NOTION_BASE)
			base = getBase({collection})
			// base = await buildBase(json)
		}

		if(content)
			base = {...base, ...getBase({content}) }

		if(collections) { 
			let arr = collections.split(', ')
			arr.map((c) => {
				let data =  getBase({collection: c})
				base[c] = data
			})
		}

		if(contents) { 
			let arr = contents.split(', ')
			arr.map((c) => {
				let data =  getBase({content: c})
				base[c] = data
			})
		}

		if(getField) { 
			let arr = getField.split(', ')
			arr.map((c) => {
				// each getField is: fieldName|value, e.g. Content Names|Welcome
				let carr = c.split('|')
				let data =  getBase({getField: carr})
				base[c] = data
			})
		}


		// if we don't specify anything, return everything
		if(Object.keys(base).length == 0) {
			base = getBase({})
		}

		json = JSON.stringify(base)
		send(res, 200, json, {
			'Content-Type': 'application/json'
		});
	} catch(err) {
		throw new Error('[notion/get] Error', err)
	}
}


