/*

    loader.js *** based on phage-api's loader.js

    - uses the API endpoints to download data into flat json files
    - use this with deploy hooks for generated content
    
    last updated: 7/30/2020

*/

const fetch = require("node-fetch")
const fs = require('fs')
const notionPath = process.argv[3] || './src/_content/notion.json'
const notionId = process.argv[2] || process.env.NOTION
const getContentFromId = require("../_utils/yotion/notion/getContentFromId")


// save from fetch stream to file
const saveJson = (async (data, path) => {
	try {
	  const fileStream = await fs.writeFileSync(path, JSON.stringify(data))
	  console.log('filestream:', path, fileStream)
	} catch(e) {
		console.error('[saveJson] error', e)
	}
});



const loadContent = async () => {

	console.log('::: Loader ::: notionId:', notionId)

	try {
    let content = await getContentFromId({id: notionId})
		let base = await buildBase(content)

		// console.log('json:', base)
		await saveJson(base, notionPath)

	} catch(err) {
		throw new Error('[yotion/loader] Error', err)
	}
}

// load all the categories
loadContent()








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
				if(!content[d.fields['Content Type']])
					content[d.fields['Content Type']] = []

				content[d.fields['Content Type']].push(d)
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







