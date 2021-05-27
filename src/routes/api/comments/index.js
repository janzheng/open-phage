
import { _tr, _err, _msg } from '@/_utils/sentry'
import { getComments, getCommentCount, postComment, deleteComment } from '../../../_utils/fauna/comments'
import { sendData } from "../../../_utils/sapper-helpers" 
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"


export async function get(req, res, next) {
	const { locId } = req.query
	let _sentry = _tr(`[comments/get]`, 'get comments')

	try {
		// const _cacheStr = `comments-${locId}`
		// const _cacheObj = cacheGet(_cacheStr, false)
		// if (_cacheObj) {
		// 	_sentry.finish()
		// 	return sendData(_cacheObj, res)
		// }

		const comments = await getComments(locId)
		// cacheSet(_cacheStr, comments, 100, false) // short cache to save fauna pings

		// _msg(`[comments/get] ${locId}`)

		// console.log('comments: ', locId, comments)
		_sentry.finish()
		sendData(comments, res)
	} catch(err) {
		console.error('[api/comments/get] error:', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}



export async function post(req, res, next) {

  const { locId, comment } = req.body
	let _sentry = _tr(`[comments/post]`, 'post comments')

	const user = req.user

	try {

		if(!user || !user['Authorizations'] || !user['Authorizations'].includes('Allow::AddComments')) {
			console.error('[comments/post] no user / not logged in / not allowed to post')
			_msg(`[comments/post] unauthorized msg post`)
			_sentry.finish()
			return sendData({}, res, 400)
		}

		console.log('posting comment')
		
		const response = await postComment(locId, user, comment)

		// update cache
		// const _cacheStr = `comments-${locId}`
		// const _cacheObj = cacheGet(_cacheStr, false)
		// if(_cacheObj) {
		// 	_cacheObj['data'].push({
		// 		...response.data,
		// 		ts: response.ts,
		// 	})
		// }
		// cacheSet(_cacheStr, comments, 60*60, false) // short cache to save fauna pings
		// console.log('response :::', response)

		console.log(`[comments/post] [${user['id']}] added @ ${locId}`)
		_msg(`[comments/post] [${user['id']}] @ ${locId}`)

		_sentry.finish()
		sendData(response, res)
	} catch(err) {
		console.error('[comments/post] error:', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}





export async function del(req, res, next) {

  const { locId, id } = req.body
	let _sentry = _tr(`[comments/delete]`, 'deleting comment')

	const user = req.user


		console.log('deleting comment', id, locId)

	try {

		if(!user || !user['Authorizations'] || !user['Authorizations'].includes('Allow::Moderation')) {
			console.error('[comments/delete] no user / not logged in / not allowed to delete')
			_msg(`[comments/delete] unauthorized msg delete`)
			_sentry.finish()
			return sendData({}, res, 400)
		}

		console.log('[comments/delete] deleting:', locId, id)
		const response = await deleteComment(id)

		// update cache
		// const _cacheStr = `comments-${locId}`
		// const _cacheObj = cacheGet(_cacheStr, false)
		// if(_cacheObj) {
		// 	_cacheObj['data'].push({
		// 		...response.data,
		// 		ts: response.ts,
		// 	})
		// }
		// cacheSet(_cacheStr, comments, 60*60, false) // short cache to save fauna pings
		// console.log('response :::', response)

		console.log(`[comments/delete] [${user['id']}] deleted ${id} @ ${locId}`)
		_msg(`[comments/delete] [${user['id']}] deleted ${id} @ ${locId}`)

		_sentry.finish()
		sendData(response, res)
	} catch(err) {
		console.error('[comments/delete] error:', err)
		_err(err)
		return sendData({error: err.message}, res, 500)
	}
}