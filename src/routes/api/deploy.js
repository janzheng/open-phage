
/*

	Used to redeploy the site itself using Vercel hooks

	last updated: 11/18/2020

*/

const fetch = require("node-fetch")	
import { sendData } from "@/_utils/sapper-helpers" 
import { _tr, _err, _msg } from '@/_utils/sentry'

export async function get(req, res) {

	let _sentry = _tr('[deploy]', 'redeploy vercel')
	const { secret } = req.query
	

	try {
		
		_sentry.finish()


		if(!secret || secret !== process.env.DEPLOY) {
			throw new Error('No deploy access / Improper setup')
		}

		// console.log('redeploying...', secret, process.env.DEPLOY)
		_msg(`[deploy] redeploying vercel`)
		_sentry.finish()

		res.writeHead(301,
		  {Location: process.env.DEPLOY}
		);
		res.end();
	} catch(err) {
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}


