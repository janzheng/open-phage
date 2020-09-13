/*

    loader.js *** based on phage-api's loader.js

    - uses the API endpoints to download data into flat json files
    - use this with deploy hooks for generated content
    
    last updated: 7/30/2020

*/

const fetch = require("node-fetch")
const fs = require('fs')
const notionPath = process.argv[3] || './static/notion.json'
const cytosisPath = process.argv[3] || './static/cytosis.json'
const notionId = process.argv[2] || process.env.NOTION
const getContentFromId = require("../_utils/yotion/notion/getContentFromId")

const Cytosis = require("cytosis").default




// save from fetch stream to file
const saveJson = (async (data, path) => {
	try {
		data['_date'] = new Date()
	  const fileStream = await fs.writeFileSync(path, JSON.stringify(data))
	  console.log('filestream:', path, fileStream)
	} catch(e) {
		console.error('[saveJson] error', e)
	}
});

const loadContent = async () => {

	console.log('::: Loader ::: notionId:', notionId)

	try {
		// handle Notion
    let content = await getContentFromId({id: notionId})
		let base = await buildBase(content)
		await saveJson(base, notionPath)


		// handle Airtable
		let cytosis = await getCytosis()
		console.log('cytosis:', cytosis)
		await saveJson(cytosis, cytosisPath)

	} catch(err) {
		throw new Error('[yotion/loader] Error', err)
	}
}







const getCytosis = async () => {
	try {
		let json;

		const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
		const apiEditorKey = process.env.OPENPHAGE_AIRTABLE_PUBLIC_API
		const baseId = process.env.OPENPHAGE_AIRTABLE_PUBLIC_BASE


	  let bases = [{
		  tables: ["Content"],
		  options: {
		    "view": view,
		  }
	  }
	  ]

	  let _cytosis = await new Cytosis({
	    apiKey: apiEditorKey,
	    baseId: baseId,
	    bases: 	bases,
	    routeDetails: '[content/get]',
	  })

	  delete _cytosis.apiKey
	  delete _cytosis.baseId

	  return _cytosis

	} catch(e) {
		console.error('[getCytosis] error:', e)
	}
}




// converts the json id object to a base object
const buildBase = async (json) => {
	try {
		// a base object is a page with content and table
		// the content of the base page is ignored and treated like comments and instructions
		// the collections
		const collections = json.content.filter(c => c.type==="collection_view")
		const base = {} // lists all collections at the base, by name
		const content = {} // lists all collection items by respective content type

		collections.map(c => {
			base[c.value] = c.table

			c.table.map(d => {

				// create a new content type category
				if(!content[d.fields['Content Types']]) {
					content[d.fields['Content Types']] = []
				} 

				if(!Array.isArray(d.fields['Content Types'])) {
					content[d.fields['Content Types']].push(d)
				} else if(d.fields['Content Types'].length>0) {
					d.fields['Content Types'].map(type => {
						content[type].push(d)
					})
				}
			

			})
		})

		return {
			id: json.id,
			collections,
			json,
			content,
			... base
		}
	} catch(e) {
		console.error('[buildBase] error:', e)
	}
}










// load notion and airtable
loadContent()
















