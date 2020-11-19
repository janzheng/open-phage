

// password reset / forgot password

import { _tr, _err, _msg } from '@/_utils/sentry'
import { hashPassword, getToken, getShortToken } from '../../../_utils/auth/auth-helpers'
import { findUserByEmail } from '../../../_utils/auth/auth-users'
import { notifyReset } from '../../../_utils/auth/auth-templates'
import { sendData } from '../../../_utils/sapper-helpers'


export async function post(req, res, next) {
  try {

		const {email} = req.body
	  const user = await findUserByEmail(email)

		// console.log('[forgot] finding user:', user, email)
	  // note: this causes a slight delay when users are detected, which can 
	  // cause users to "sniff" real vs. fake addresses
	  // leaving it outside the user check means wasted cycles though
    if(user) {
			const {token, tokenExpires} = await notifyReset(email, req.headers.host)
			_msg(`[passport/forgot] [${user.id}] forgot password request`)
    }

		// console.log('[forgot] returning blank!')
	  // show this message even on users that don't exist, for security
		// bad ux, good security


	  return sendData({
	    status: true,
	    message: `A reset e-mail has been sent to ${email}`, 
	  }, res)

  } catch (err) {
  	console.error('[passport/forgot]', err)
    // next(error)

		_err(err)
	  return sendData({
	    status: false,
	    message: 'Provide a valid email', 
	  }, res)
  }

}



