

import marked from 'marked';
import Cytosis from 'cytosis';

import NodeCache from 'node-cache'
import { mdReplace } from "./_helpers.js"




const nodecache = new NodeCache();
const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'

const apiReadKey = process.env.P2050_AIRTABLE_PUBLIC_API
const baseId = process.env.P2050_AIRTABLE_PUBLIC_BASE




const getTemplate = async (name) => {

  const cacheStr = `template-${name}`
  if (nodecache.get(cacheStr)) {
    return nodecache.get(cacheStr)
  }

	try {
	  const cytosis = await new Cytosis({
	    apiKey: apiReadKey,
	    baseId: baseId,
	    bases:  [
	      {
	        tables: ['Content'],
	        options: {
	          "view": view,
	          keyword: `${name}`,
	          matchKeywordWithFields: ['Name'],
	          matchStyle: 'exact',
	          maxRecords: 1,
	        }
	      },
	    ],
	    routeDetails: '[api/feed/getPostSearch]',
	  })
    nodecache.set(cacheStr, cytosis.results['Content'][0].fields['Markdown'], 60*60*6)
  	return cytosis.results['Content'][0].fields['Markdown']
	} catch(e) {
		console.error('getTemplate', e)
	}

}


const replaceDict = (registered, type, json)  => {
	return {
		type: `${type}`,
		name: `${registered.fields['Name']}`,
		email: `[${registered.fields['Email']}](${registered.fields['Email']})`,
		eventName: json ? json.session.fields['Name'] : ' ',
	}
}


export const adminTemplate = async (registered, type, json) => {
	// console.log('adminTemplate:', registered, type)
	const dict = replaceDict(registered, type)
	const template = await getTemplate('email-admin')
	const replaced = mdReplace(template, dict)
	return marked(replaced)
}

export const subscribeTemplate = async (registered, type) => {
	// console.log('subscribeTemplate:', registered, type)
	const dict = replaceDict(registered, type)
	const template = await getTemplate('email-subscribe')
	const replaced = mdReplace(template, dict)
	// console.log('subscribeTemplate:::: template', template, replaced)
	return marked(replaced)
}

export const signupTemplate = async (registered, type, json) => {
	// console.log('adminTemplate:', registered, type)
	const dict = replaceDict(registered, type, json)
	const template = await getTemplate('email-event-signup')
	const replaced = mdReplace(template, dict)
	return marked(replaced)
}






