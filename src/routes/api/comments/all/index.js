

import { _tr, _err, _msg } from '@/_utils/sentry'
import { getAllComments } from '@/_utils/fauna/comments.js'
import { sendData } from "../../../../_utils/sapper-helpers" 
import { cacheGet, cacheSet, cacheClear } from "../../../../_utils/cache"


export async function get(req, res, next) {

	try {
		let _sentry = _tr('[comments/all]', 'get all comments')

		// const _cacheStr = `all-comments`
		// const _cacheObj = cacheGet(_cacheStr, false)
		// if (_cacheObj) {
		// 	_sentry.finish()
		// 	return sendData(_cacheObj, res)
		// }

		const comments = await getAllComments()
		// cacheSet(_cacheStr, comments, 500, false) // short cache to save fauna pings, long enough to be useful for server
	
		_sentry.finish()
		sendData(comments, res)
	} catch(err) {
		console.error('[api/comments/all/get] error:', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}

