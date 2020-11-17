

import { getAllComments } from '../../../../_utils/fauna/comments'
import { sendData } from "../../../../_utils/sapper-helpers" 
import { cacheGet, cacheSet, cacheClear } from "../../../../_utils/cache"


export async function get(req, res, next) {

	try {
		const _cacheStr = `all-comments`
		const _cacheObj = cacheGet(_cacheStr, false)
		if (_cacheObj) {
			return sendData(_cacheObj, res)
		}

		const comments = await getAllComments()
		cacheSet(_cacheStr, comments, 500, false) // short cache to save fauna pings, long enough to be useful for server

    console.log('?!!??!', comments)
		sendData(comments, res)
	} catch(e) {
		console.error('[api/comments/all/get] error:', e)
	}
}

