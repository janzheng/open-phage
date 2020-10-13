

// account activation / sign up verification
// link and token generation and login
// this works [almost] the same as magic link
// combines signup.js w/ magic link
// *** uses the same token and expiry as the magic link token
// this endpoint should be called after an account has been created

// import send from '@polka/send';
// import redirect from '@polka/redirect'

import { sanitizeUserForClient, hashPassword, getToken, getShortToken } from '../../../../_utils/auth/auth-helpers'
import { notify } from '../../../../_utils/notify.js'
import { addUser, findUserByToken, findUserByEmail } from '../../../../_utils/auth/auth-users'
import { sendData } from '../../../../_utils/sapper-helpers'
import { notifyActivate } from '../../../../_utils/auth/auth-templates'
import { getProfileById } from '../../profile/index'
import { addProfileForNewUser } from '../../../../_utils/auth/auth-custom'


// this logs a user in and deletes the token
export async function get(req, res, next) {
  try {

    const { token } = req.params
    const user = await findUserByToken(token, {activateUser: true, deleteTokens: true})

    if (!user) {
      return sendData({
        status: false,
        message: `Verification token is invalid or has expired.`, 
      }, res)
    }

    req.login(user, async function(err) {
      if (err) { 
        console.error('[api/auth/login] error:', err)
        return next(err)
      }

      // create a new record in Profiles that's linked to the Account
      const record = await addProfileForNewUser(user, {userName: user['email']})

      // specific to sc-profiles
      if(user.Profile && user.Profile.length > 0) {
        user['Profile'] = await getProfileById(user.Profile[0]) 
      }

      return sendData({
        status: true,
        message: `Account activated!`, 
        user: sanitizeUserForClient(user),
      }, res)

    });


  } catch(error) {
    console.error('[api/auth/activate] error:', error)
    // next(error)
  }
}




export async function post(req, res, next) {
  try {

    const {username, email, password} = req.body
    // console.log('>>> activate signup passport', email, password)

    const existingUser = await findUserByEmail(email)

    if(!existingUser) {
      const user = {
        username,
        email,
        password,
      }

      const _user = await addUser({email, password})

      // note: this causes a slight delay when users are detected, which can 
      // cause users to "sniff" real vs. fake addresses
      if(_user) {

        await notifyActivate(email, req.headers.host)
      }

    } else {
      // send a "user exists" email for this user, or a magic link here to log in?
    }

    // show this message even on users that don't exist, for security
    // bad ux, good security
    return sendData({
      status: true,
      message: `An activation e-mail has been sent to ${email}`, 
    }, res)

  } catch (error) {
    console.error('[api/auth/activate] error:', error)
    // next(error)
    return sendData({
      status: false,
      message: `Provide a valid email`, 
    }, res)
  }

}



