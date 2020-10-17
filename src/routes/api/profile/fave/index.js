

/*

	This is a collection of fave-specific profile helpers:
	- Add / remove to bookmark / favorites
	- Update fave notes
	- Upvotes

	This _might_ at some point also use Fauna functions

*/



import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear, getCacheKeys} from "../../../../_utils/cache"
// import { getContentFromTable } from "../../../../_utils/notion"
import { sendData } from "../../../../_utils/sapper-helpers" 
import { saveSetup, save } from '../../../../_utils/save.js'

import { findUserByEmail } from '../../../../_utils/auth/auth-users'
import { getProfileByPhid, saveProfile } from '../index.js'

config(); // https://github.com/sveltejs/sapper/issues/122

let json
const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'
const domain = process.env.DOMAIN 

const apiReadKey = process.env.AIRTABLE_ACCOUNTS_API
const apiWriteKey = process.env.AIRTABLE_ACCOUNTS_WRITE_API
const baseId = process.env.AIRTABLE_ACCOUNTS_BASE
const userTableName = 'Profiles'

saveSetup({ // for easy airtable saving
  apiWriteKey: apiWriteKey,
  baseId: baseId,
})










// export async function get(req, res) {
//   const { id, slug, _phid, userName } = req.query
//   let profile = {}

//   try {
//     if(id)
//       profile = await getProfileById(id)
//     else if(slug)
//       profile = await getProfileBySlug(slug)
//     else if(_phid)
//       profile = await getProfileByPhid(_phid)
//     else if(userName)
//       profile = await getProfileByUsername(userName)

//     // turn off auto domain-based public profiles
//     // else
//       // profile = await getProfile()

//     if(profile && profile.fields && profile.fields['Domain']) {
//       profile['Domain'] = domain 
//     }

//     if(profile && profile.fields && profile.fields['ContentSource'] === 'Notion' && profile.fields['NotionTableId'])
//       profile['Notion'] = await getContentFromTable(profile.fields['NotionTableId']) 

//     // console.log('Profile:::', profile)

//     if(profile)
//       return sendData({
//         status: true,
//         data: profile
//       }, res)
//     else
//       return sendData({
//         status: false,
//         data: undefined
//       }, res)

//   } catch(err) {
//     console.error('[api/profile/get]', err)
//   }
// }



export async function post(req, res) {
  // const {Name, PublicEmail, Social, Pitch, Title, CV} = req.body
  const { type } = req.query
  let { url } = req.body

  // not sure why it wraps req around _ctx
  let user = req.session._ctx.user

  // ensure logged in
  if (!user) {
    console.error('[api/profile/fave] no access:', user, req.session._ctx.user['Profile'][0], req.body['recordId'])
    res.statusCode = 401
    res.end('No access')
    return
  }



  let userProfile = await getProfileByPhid(user['_phid'], false) // get logged in user's profile

  console.log('>>>>>', type)
  if(type === 'addLectureBookmark') {
    if(!userProfile.fields['PGH Bookmarks']) {
    	userProfile.fields['PGH Bookmarks'] = [url]
    } else if(!userProfile.fields['PGH Bookmarks'].includes(url)) {
    	userProfile.fields['PGH Bookmarks'].push(url)
    }
  } else if (type === 'removeLectureBookmark') {
    if(userProfile.fields['PGH Bookmarks']) {
      let index = userProfile.fields['PGH Bookmarks'].indexOf(url)
      if(index > -1)
        userProfile.fields['PGH Bookmarks'].splice(index,1)
    }
  }


  try {
    // save the profile
    userProfile = await saveProfile({
    	recordId: userProfile.fields['recordId'],
    	'PGH Bookmarks': userProfile.fields['PGH Bookmarks']
    })

    // return sendData({
    //   status: true,
    //   data: userProfile,
    // }, res)

    // need to re-log in to update server session
    user['Profile'] = userProfile
    req.login(user, async (err) => {

      console.log('XXXXXX Cleanup:', getCacheKeys())
      return sendData({
        status: true,
        data: userProfile,
      }, res)
    })

  } catch(err) {
    console.error('[api/profile/fave]', err)
  }
}





