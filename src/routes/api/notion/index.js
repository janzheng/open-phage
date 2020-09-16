

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

export const getBase = ({collection, content, getField, getLecture, getClass}) => {
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

			// console.log('getField:', getField)
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


		if(getLecture) {
			let lectureObj

			// get lecture item
			Object.keys(_base.content).map(baseKey => {
				_base.content[baseKey].map(item => {
					if(item.fields['Slug'] == getLecture) {
						lectureObj = item
					}
				})
			})

			let contentName = lectureObj.fields['Content ID']
			let items = []


			// then get the lecture contents "Content ID" from 
			// Lecture Content and Lab Experiments tables
			let collection = getBase({collection: 'Lecture Content'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					items.push(item)
				}
			})

			collection = getBase({collection: 'Lab Experiments'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					items.push(item)
				}
			})

			collection = getBase({collection: 'Lab Videos'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					items.push(item)
				}
			})

			return {
				lecture: lectureObj,
				classes: items,
			}
		}





		if(getClass) {
			let classObj

			// get class item
			Object.keys(_base.content).map(baseKey => {
				_base.content[baseKey].map(item => {
					if(item.fields['Slug'] == getClass) {
						classObj = item
					}
				})
			})

			let contentName = classObj.fields['Content ID']
			let items = []
			let lecture


			// get the Lecture Series
			let collection = getBase({collection: 'Lecture Series'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					lecture = item
				}
			})

			// then get the lecture contents "Content ID" from 
			// Lecture Content and Lab Experiments tables
			collection = getBase({collection: 'Lecture Content'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					items.push(item)
				}
			})

			collection = getBase({collection: 'Lab Experiments'})
			collection.map(item => {
				if(item.fields['Content ID'] == contentName) {
					items.push(item)
				}
			})

			return {
				lecture,
				class: classObj,
				classes: items,
			}
		}

	  return _base
	} catch(e) {
		console.error('[getBase] error:', e)
	}
}





export async function get(req, res) {

	const {id, collection, collections, content, contents, getField, fields, getLecture, getClass} = req.query
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

		// grab by collection (e.g. database or table)
		if(collections) { 
			let arr = collections.split(', ')
			arr.map((c) => {
				let data =  getBase({collection: c})
				base[c] = data
			})
		}

		// grab by content type
		if(contents) { 
			let arr = contents.split(', ')
			arr.map((c) => {
				let data =  getBase({content: c})
				base[c] = data
			})
		}

		// get from a field like Slug
		if(getField) { 
			let arr = getField.split(', ')
			arr.map((c) => {
				// each getField is: fieldName|value, e.g. Content IDs|Welcome
				let carr = c.split('|')
				let data =  getBase({getField: carr})
				base[c] = data
			})
		}

		// build a lecture by getting a slug and getting its associated classes
		// through "Content ID"
		if(getLecture) { 
			base = {...base, ...getBase({getLecture}) }
		}

		// get a class through slug, but also return the lecture series and adjoining classes
		if(getClass) { 
			base = {...base, ...getBase({getClass}) }
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


