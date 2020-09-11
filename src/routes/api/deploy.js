

const fetch = require("node-fetch")	
import send from '@polka/send';

export async function get(req, res) {

	const { secret } = req.query
  let json


  if(secret !== process.env.DEPLOY_SECRET) {
		send(res, 500, JSON.stringify({status: false}), {
			'Content-Type': 'application/json'
		});
		throw new Error('no access')
		return
  }

	try {
  	console.log('redeploying...', secret, process.env.DEPLOY)

		res.writeHead(301,
		  {Location: process.env.DEPLOY}
		);
		res.end();
	} catch(err) {
		throw new Error('[notion/get] Error', err)
	}
}


