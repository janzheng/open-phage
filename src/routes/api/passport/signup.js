
// https://gist.github.com/nemtsov/6c2c24fa565a29404b487c61ce5bae4f

import passport from 'passport'
// import send from '@polka/send';

import { sanitizeUserForClient, hashPassword } from '../../../_utils/auth/auth-helpers'
import { addUser, users, findUserByEmail } from '../../../_utils/auth/auth-users'
import { sendData } from '../../../_utils/sapper-helpers'
import { addProfileForNewUser } from '../../../_utils/auth/auth-custom'

import { getProfileByUsername } from '../profile/index'

export async function post(req, res, next) {
  try {

		const {email, password, userName} = req.body

		console.log('[api/auth/signup]:', email, password, userName)

    const existingUser = await findUserByEmail(email)

    // this should already have been caught on front-end
    let usernameCheck = await getProfileByUsername(userName)
    if(usernameCheck) {
	  	return sendData({
	  		status: false,
	  		message: 'Please try using another user name'
	  	}, res)
    }

    if(!existingUser) {
			const user = {
		    email,
		    password,
		    userName,
		  }

		  // do this explicitly to whitelist account info
		  const _user = await addUser({
		  	email, password,
		    'Collections': ['Public'], // add Public collection to all new users
		  })

		  return req.login(_user, async (err) => {
		    if (err) next(err);
		    else {
		    	// create a new record in Profiles that's linked to the Account
		    	const record = await addProfileForNewUser(_user, {userName})

			    // console.log('new profile record: USER PROFILE::::', record)
			    _user['Profile'] = record
			    _user['userName'] = [record.fields['userName']] 
			    // this is normally calculated, but needs to be manually attached to a new user 
		    	return sendData({
			  		status: true,
			  		message: 'Signed up!',
		    		user: sanitizeUserForClient(_user)
		    	}, res)
				}
		  });
    }

    // should this trigger an email reminder?
  	return sendData({
  		status: false,
  		message: 'Please try using another email address'
  	}, res)

  } catch (error) {
  	console.error('[api/auth/signup] error:', error)
    // next(error)
  }

}

