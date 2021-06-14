
import { _tr, _err, _msg } from '@/_utils/sentry'
import { hashPassword,  } from '@/_utils/auth/auth-helpers'
import { findUserByToken, resetPasswordFromToken } from '@/_utils/auth/auth-users'
import { notify } from '@/_utils/mailer.js'
import { sendData } from '@/_utils/sapper-helpers'
import { notifyResetConfirmation } from '@/_utils/auth/auth-templates'




// this checks if token exists; should be used for validation or for testing the token only
// does not delete tokens!
export async function get(req, res, next) {
  try {

    const { token } = req.params
	  const user = await findUserByToken(token)

	  if (!user) {
	 	  console.error('Password reset token is invalid or has expired.')
      return sendData({
        status: false,
        message: `Password reset token is invalid or has expired.`, 
      }, res)
	  }

	  // console.log('Reset token is still valid.', user)
    
    return sendData({
      status: true,
      message: `Reset token is still valid.`, 
    }, res)

	} catch(err) {
    console.error('[passport/reset/get]', err)
    // // next(error)
    _err(err)
  }
}



// resets the password with a token
export async function post(req, res, next) {
  try {

		const {token, password} = req.body
	  const user = await resetPasswordFromToken(token, password)

	  if (!user) {
	 	  console.error('Password reset token is invalid or has expired.')
      return sendData({
        status: false,
        message: `Password reset token is invalid or has expired.`, 
      }, res)
	  }

    await notifyResetConfirmation(user.email)

    _msg(`[passport/reset] [${user.id}] password reset`)

    return sendData({
      status: true,
      message: `The password for your account "${user.email}" has just been changed. Please log in using your new password.`, 
    }, res)

  } catch (err) {
  	console.error('[passport/reset/post]', err)
    // next(error)
    _err(err)
  }

}



