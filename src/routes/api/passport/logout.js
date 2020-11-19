
// https://gist.github.com/nemtsov/6c2c24fa565a29404b487c61ce5bae4f

import { _tr, _err, _msg } from '@/_utils/sentry'
import { sendData } from '../../../_utils/sapper-helpers'

export async function get(req, res, next) {
	try {
		const user = req.user

	  req.logout()
	  // redirect(res, '/');

	  sendData({
	    status: true,
	    message: 'Logged out!', 
	    // user: sanitizeUserForClient(user),
	  }, res)
  } catch (err) {
  	console.error('[passport/logout] error', err)
		// next(error)
		_err(err)
  }
}
