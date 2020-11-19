

// magic login link

import { _tr, _err, _msg } from '@/_utils/sentry'
import { sanitizeUserForClient, hashPassword, getToken, getShortToken } from '../../../../_utils/auth/auth-helpers'
import { findUserByToken, findUserByEmail } from '../../../../_utils/auth/auth-users'
import { notifyMagic } from '../../../../_utils/auth/auth-templates'
import { sendData } from '../../../../_utils/sapper-helpers'
import { getProfileById } from '../../profile/index'




// this logs a user in and deletes the token
export async function get(req, res, next) {
  try {

    const { token } = req.params
	  const user = await findUserByToken(token, {deleteTokens: false})

	  if (!user) {
	 	  console.error('Password reset token is invalid or has expired.')
      return sendData({
        status: false,
        message: `Password reset token is invalid or has expired.`, 
      }, res)
	  }

	  req.login(user, async function(err) {
	    if (err) { 
				_err(err)
		  	console.error('[passport/magic] error:', err)
		  	return next(err)
		  }

			// specific to sc-profiles
			if(user.Profile && user.Profile.length > 0) {
				user['Profile'] = await getProfileById(user.Profile[0]) 
			}

      return sendData({
        status: true,
        message: `Successfully logged in!`, 
	    	user: sanitizeUserForClient(user),
      }, res)
	  });

	} catch(err) {
    console.error('[passport/magic]', err)
		// next(error)
		_err(err)
  }
}



// this actually sends out the reset link
export async function post(req, res, next) {
  try {
		let _sentry = _tr(`[passport/magic]`, 'magic link request')

		const {email} = req.body
	  const user = await findUserByEmail(email)

	  // note: this causes a slight delay when users are detected, which can 
		// cause users to "sniff" real vs. fake addresses
		// BUT not awaiting might cause Vercel to time out before an email is sent
    if(user) {
			await notifyMagic(email, req.headers.host)
			_msg(`[passport/magic] [${_user.id}] requested link`)
    } else {
    	console.error('Magic link not sent; no account found for ', email)
    }

	  // show this message even on users that don't exist, for security
		// bad ux, good security
		_sentry.finish()
	  return sendData({
	    status: true,
	    message: `An e-mail containing the log in link has been sent to ${email}`, 
	  }, res)


  } catch (err) {
  	console.error('[passport/magic]', err)
    // next(error)
		_err(err)

	  return sendData({
	    status: false,
	    message: 'Provide a valid email', 
	  }, res)
  }

}



