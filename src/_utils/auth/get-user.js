

/*

	Helper. Used by front-end to grab the user on mount.

	Last updated: 8/9/2020
	
*/

import { logger, logerror } from '../logger';
import { User } from '../../stores/stores.js';




export const getUser = async (setStore=true) => {
  try {
    const response = await fetch(`api/passport/login`)

    if(response.status == 200) {
      const results = await response.json()
      // console.log('[getUser] Latest user object:', results)

      if(results.user) {
        // console.log('get user -->', results.user, setStore, User)

        if(setStore && User) { // update the UI store w/ user object
          User.set(results.user) // update the store object
        } 

        return results.user
      } else {
        // update User w/ error object so components can handle properly
        User.set(results)
      }

      return results
    } else {
      // error = err
      logger('[getUser]', 'error:', results)
    }
  } catch (err) {
    console.error(err)
    logerror('[getUser]', 'Error:', err)
  }

  return undefined
}