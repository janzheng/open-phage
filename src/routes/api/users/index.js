
// logs into fauna
// import { query as q } from 'faunadb'
// import faunadb from 'faunadb'

import Cytosis from 'cytosis';
import NodeCache from 'node-cache';
// import { config } from "dotenv";
import { sendData } from "@/_utils/sapper-helpers" 

import { _tr, _err, _msg } from '@/_utils/sentry'

const cache = new NodeCache();
let json



const apiReaderKey = process.env.AIRTABLE_ACCOUNTS_API
const apiWriteKey = process.env.AIRTABLE_ACCOUNTS_WRITE_API
const baseId = process.env.AIRTABLE_ACCOUNTS_BASE





// export const profileApi = async faunaSecret => {
// 	const faunaClient = new faunadb.Client({secret: faunaSecret})
//   const ref = await faunaClient.query(q.Identity())
//   return {id: ref.id}
// }


// gets specific user data
const getProfiles = async (userId) => {
	const cachedContent = cache.get(userId)

	if (cachedContent) {
		console.log('$: User — loaded cached controller')
		return Promise.resolve(cachedContent)
	}

	try {
	  let bases = [
	  {
		  tables: ['Profiles'],
		  options: {
		    "view": "Published",
        keyword: userId,
        matchKeywordWithField: 'UserId',
        matchStyle: 'exact'
		  }
	  },
	  ]

	  let _cytosis = await new Cytosis({
	    apiKey: apiReaderKey,
	    baseId: baseId,
	    bases: 	bases,
	    routeDetails: '[user/getProfiles]'
	  })

	  
	  if(_cytosis.results['Profiles'] && _cytosis.results['Profiles'].length > 0)
			json = _cytosis.results['Profiles'][0]//JSON.stringify(_cytosis)
		else
			json = {}


		console.log('user cytosis data::::', _cytosis.results['Profiles'])

		cache.set(userId, json, 500000 );
		return Promise.resolve(json)

	} catch(err) {
		throw new Error('[faves/getProfiles] Error', err)
	}
}




// return user data from Airtable if given a Fauna user id
export const get = async (req, res, next) => {

	let _sentry = _tr('[users/get]', 'get a user + profile')
  const user = req.session.user

  if (!user) {
		res.statusCode = 401
		_sentry.finish()
		_msg('No access')
		res.end('No access')
		return
  }

  try {
		const result = await profileApi(user)

		// console.log('user data result: ', result)
		// console.log(' >>> getting user profile >>>', result.id)

		const Profiles = await getProfiles(result.id)
		
		result['content'] = Profiles
	  req.session.userRecord = Profiles['id']

		_msg('get user profile')



		_sentry.finish()
		return sendData(result, res)
  } catch(err) {
		console.error('profile.js no fauna access / something went wrong', err)
		// throw new Error(err)
		_err(err)
		return sendData({error: err.message}, res, 500)
  }
}











export const post = async (req, res) => {

	let _sentry = _tr('[users/post]', 'update a user profile')
	// json = JSON.stringify(req.body)
	json = req.body // JSON.parse(json)

	try {
		// validate?
	  const saveToCytosis = async () => {
	    await Cytosis.save({
	    	recordId: json.recordId || null,
	      apiKey: apiWriteKey,
	      baseId: baseId,
	      tableName: 'Profiles',
	      tableOptions: {
	        // insertOptions: ['typecast'],
	      },
	      payload: {
	      	'UserId': json.userId,
	      	'Name': json.name,
	        'Email': json.email,
	      }
	    })
	  }

	  await saveToCytosis()

  	// if(json.mailer && json.mailer.send) {
	  // 	try {
			// 	const mail = automailer(json.mailer)
			//   .then(function (response) {
			//     // console.log(response);
			// 		res.end('post completed, email sent!')
			//   })
	  // 	} catch(err) {
	  // 		console.error('mail error:', err)
	  // 	}
  	// }

		_sentry.finish()
		// res.end('[api/user] save complete')
		return sendData({status: true}, res, 200)
	} catch(err) {
		console.error('[users/post] save failed:', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}

}






