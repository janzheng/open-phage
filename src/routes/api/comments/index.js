

import { getComments, getCommentCount, postComment } from '../../../_utils/fauna/comments'
import { sendData } from "../../../_utils/sapper-helpers" 
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"


export async function get(req, res, next) {
	const { locId } = req.query

	try {
		const _cacheStr = `comments-${locId}`
		const _cacheObj = cacheGet(_cacheStr, false)
		if (_cacheObj) {
			return sendData(_cacheObj, res)
		}

		const comments = await getComments(locId)
		cacheSet(_cacheStr, comments, 100, false) // short cache to save fauna pings

		// console.log('comments: ', locId, comments)
		sendData(comments, res)
	} catch(e) {
		console.error('[api/comments/get] error:', e)
	}
}



export async function post(req, res, next) {

  const { locId, comment } = req.body
	const user = req.user

	if(!user || !user['Authorizations'] || !user['Authorizations'].includes('Allow::AddComments')) {
		console.error('[api/comments] no user / not logged in / not allowed to post')
		return sendData({}, res, 400)
	}

	try {
		const response = await postComment(locId, user, comment)

		// update cache
		const _cacheStr = `comments-${locId}`
		const _cacheObj = cacheGet(_cacheStr, false)
		if(_cacheObj) {
			_cacheObj['data'].push({
				...response.data,
				ts: response.ts,
			})
		}
		// cacheSet(_cacheStr, comments, 60*60, false) // short cache to save fauna pings
		// console.log('response :::', response)
		sendData(response, res)
	} catch(e) {
		console.error('[api/comments/post] error:', e)
	}
}