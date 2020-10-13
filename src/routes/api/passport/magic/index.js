

// magic login link

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
		  	console.error('[api/auth/login] error:', err)
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

	} catch(error) {
    console.error('[api/auth/magic]', error)
    // next(error)
  }
}



// this actually sends out the reset link
export async function post(req, res, next) {
  try {

		const {email} = req.body
	  const user = await findUserByEmail(email)

	  // note: this causes a slight delay when users are detected, which can 
	  // cause users to "sniff" real vs. fake addresses
    if(user) {
			notifyMagic(email, req.headers.host)
    } else {
    	console.error('Magic link not sent; no account found for ', email)
    }

	  // show this message even on users that don't exist, for security
	  // bad ux, good security
	  return sendData({
	    status: true,
	    message: `An e-mail containing the log in link has been sent to ${email}`, 
	  }, res)


  } catch (error) {
  	console.error('[api/auth/magic]', error)
    // next(error)

	  return sendData({
	    status: false,
	    message: 'Provide a valid email', 
	  }, res)
  }

}



