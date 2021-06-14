

// ex:  https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
//      https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
//  // the `slug` parameter is available because this file
//  // is called [slug].json.js
//  const { slug } = req.params;

//  const article = await db.get(slug);

//  if (article !== null) {
//    res.setHeader('Content-Type', 'application/json');
//    res.end(JSON.stringify(article));
//  } else {
//    next();
//  }
// }

import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
// import { getContentFromTable } from "../../../_utils/notion"
import { sendData } from "@/_utils/sapper-helpers" 
import { saveSetup, save } from '@/_utils/save.js'
import { _tr, _err, _msg } from '@/_utils/sentry'

import { findUserByEmail } from '@/_utils/auth/auth-users'


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

// Gets profiles and filters them by Domain
// const getProfile = async () => {
//   let cacheStr = `${view}-Content`
//   if(domain)
//     cacheStr = `${domain}-${cacheStr}`

//   if (cacheGet(cacheStr)) {
//     return cacheGet(cacheStr)
//   }

//   try {
//     let bases = [
//     {
//       tables: ['Content','Profiles'],
//       options: {
//         "view": view,
//       }
//     },
//     ]

//     // console.log('loading ctrl cytosis...', bases)

//     let _cytosis = await new Cytosis({
//       apiKey: apiReadKey,
//       baseId: baseId,
//       bases:  bases,
//       routeDetails: '[api/getProfile]',
//     })


//     if(domain) { // for prototyping make sure the domain matches 
//       _cytosis.results['Profile'] = _cytosis.results['Profiles'].filter(profile => profile.fields['Domain'] == domain)[0]
//     } else
//       return undefined

//     const profile = _cytosis.results['Profiles'][0]
//     cacheSet(cacheStr, profile, 60*60 )
//     return profile

//   } catch(err) {
//     throw new Error('[api/getProfile] Error', err)
//   }
// }






// get record of a profile
export const getProfileById = async (id, useCache=true) => {

  let cacheStr = `profile-${id}`
  let cacheObj = cacheGet(cacheStr, true)
  if (useCache && cacheObj)
    return cacheObj

  const record = await Cytosis.getRecord({
    recordId: id,
    tableName: 'Profiles',
    apiKey: apiReadKey,
    baseId: baseId,
  })
  

  // simple object cleanup
  let clean = {
    fields: record['fields'],
    id: record['id'],
  }

  cacheSet( cacheStr, clean, 60*60, false )
  return clean

  return record
}



// this works b/c Accounts' index uses _phid as master reference between Accounts and Profiles
export const getProfileByPhid = async (_phid, useCache=true) => {
  let cacheStr = `profile-${_phid}`
  let cacheObj = cacheGet(cacheStr, false)
  if (useCache && cacheObj)
    return cacheObj

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          "maxRecords": 1,
          keyword: `${_phid}`,
          matchKeywordWithFields: ['Accounts'],
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/getProfileByPhid]',
  })

  if(cytosis.results['Profiles'] && cytosis.results['Profiles'][0]) {
    // simple object cleanup
    let clean = {
      fields: cytosis.results['Profiles'][0]['fields'],
      id: cytosis.results['Profiles'][0]['id'],
    }
    cacheSet( cacheStr, clean, 60*60, false )
    return clean
  }

  return undefined
}



// get record of a profile
export const getProfileBySlug = async (slug, useCache) => {

  let cacheStr = `profile-${slug}`
  let cacheObj = cacheGet(cacheStr, true)
  if (useCache && cacheObj)
    return cacheObj

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          "maxRecords": 1,
          keyword: `${slug}`,
          matchKeywordWithFields: ['Slug'],
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/getProfileBySlug]',
  })

  if(cytosis.results['Profiles'] && cytosis.results['Profiles'][0]) {
    // simple object cleanup
    let clean = {
      fields: cytosis.results['Profiles'][0]['fields'],
      id: cytosis.results['Profiles'][0]['id'],
    }
    cacheSet( cacheStr, clean, 60*60, false )
    return clean
  }

  return undefined
}



// get record of a profile
export const getProfileByUsername = async (userName, useCache) => {

  let cacheStr = `profile-${userName}`
  let cacheObj = cacheGet(cacheStr, true)
  if (useCache && cacheObj)
    return cacheObj

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          "maxRecords": 1,
          keyword: `${userName}`,
          matchKeywordWithFields: ['userName'],
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/getProfileByUsername]',
  })

  if(cytosis.results['Profiles'] && cytosis.results['Profiles'][0]) {
    // simple object cleanup
    let clean = {
      fields: cytosis.results['Profiles'][0]['fields'],
      id: cytosis.results['Profiles'][0]['id'],
    }
    cacheSet( cacheStr, clean, 60*60, false )

    return clean 
  }

  return undefined
}



// finds profiles that liked a specific faveId
export const getProfilesByFaveId = async (faveId, useCache=false) => {
  // let cacheStr = `profiles-faveid-${faveId}`
  // let cacheObj = cacheGet(cacheStr, false)
  // if (useCache && cacheObj)
  //   return cacheObj

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          keyword: `${faveId}`,
          matchKeywordWithFields: ['Favorites'],
          matchStyle: 'partial',
          fields: ['Name','ProfileImage'],
        }
      },
    ],
    routeDetails: '[api/getProfilesByFaveId]',
  })

  // clean up profiles; these are for the public
  return cytosis.results['Profiles']
}









export const clearProfileCache = async (user) => {
  // profile-username
  cacheClear(`profile-${user['userName'][0]}`)
  // profile-slug
  cacheClear(`profile-${user['Profile']['Slug']}`)
  // profile-phid
  cacheClear(`profile-${user['_phid']}`)
  // profile-id
  cacheClear(`profile-${user.id}`)
}




// save profile back to airtable
export const saveProfile = async (profile) => {

  // const {recordId, Name, PublicEmail, Social, Pitch, Title, CV} = profile
  const recordId = profile.recordId
  delete profile.recordId

  try {
    const record = await save({
      tableName: 'Profiles',
      payload: profile,
      recordId,
      insertOptions: ['typecast']
    })

    cacheClear(`profile-${recordId}`)
    cacheClear(`profile-${record.fields['Slug']}`)
    cacheClear(`profile-${record.fields['_phid']}`)
    return record

  } catch(e) {
    console.error('saveProfile error:', e)
  }
}



// save account back to airtable
export const saveAccount = async (user, req) => {

  let account = req.body
  let recordId = user['recordId']
  try {
    const record = await save({
      tableName: 'Accounts',
      payload: {
        email: account.email
      },
      recordId,
    })

    return record

  } catch(e) {
    console.error('saveAccount error:', e)
  }
}











export async function get(req, res) {
  const { id, slug, _phid, userName, faveId } = req.query
  let profile = {}

  try {
    if(id)
      profile = await getProfileById(id)
    else if(slug)
      profile = await getProfileBySlug(slug)
    else if(_phid)
      profile = await getProfileByPhid(_phid)
    else if(userName)
      profile = await getProfileByUsername(userName)
    else if(faveId)
      profile = await getProfilesByFaveId(faveId)

    // turn off auto domain-based public profiles
    // else
      // profile = await getProfile()

    if(profile && profile.fields && profile.fields['Domain']) {
      profile['Domain'] = domain 
    }

    // if(profile && profile.fields && profile.fields['ContentSource'] === 'Notion' && profile.fields['NotionTableId'])
      // profile['Notion'] = await getContentFromTable(profile.fields['NotionTableId']) 

    // console.log('Profile:::', profile)

    if(profile)
      return sendData({
        status: true,
        data: profile
      }, res)
    else
      return sendData({
        status: false,
        data: undefined
      }, res)

  } catch(err) {
    console.error('[api/profile/get]', err)
    _err(err)
  }
}



export async function post(req, res) {
  // const {Name, PublicEmail, Social, Pitch, Title, CV} = req.body

  const { type } = req.query
	let _sentry = _tr(`[profile/post]`, 'save profile')

  // not sure why it wraps req around _ctx
  let user = req.session._ctx.user

  // ensure logged in and the user owns the profile 
  // (userIds have to match between the Account's profile and the profile itself)
  // console.log('user check:', req.session._ctx.user, req.body)
  if (!user || req.session._ctx.user['Profile'].id !== req.body['recordId']) {
    console.error('[api/profile/post] no access:', user, req.session._ctx.user['Profile'].id, req.body['recordId'])
    res.statusCode = 401
		_sentry.finish()
    res.end('No access')
    return
  }


  if(type === 'avatar') {
    // console.log('AVATAR FILES:', req.file)
    delete req.body['Avatar']
  }
  
  try {

    // if email is provided, save it against the account
    // need better checks in the future past mvp

    // check username conflict
    // trim username

    // if user wants to change email
    if(req.body['email'] && (req.body['email'] !== user['email'])) {
      let emailCheck = await findUserByEmail(req.body['email'])
      // check email conflict
      if (emailCheck) {
        return sendData({
          status: false,
          message: 'The provided email is unavailable'
        }, res)
      }

      // update user object
      user = await saveAccount(user, req) // update the account and session w/ req
    }


    // check username
    let userProfile = await getProfileById(user['Profile'].id) // get logged in user's profile
    let usernameCheck = await getProfileByUsername(req.body['profile']['userName'])

    // if username exists and isn't current user
    if(usernameCheck && usernameCheck.fields['_phid'][0] !== userProfile.fields['_phid'][0]) {    
  		_sentry.finish()
      return sendData({
        status: false,
        message: 'The user name is unavailable',
      }, res)
    }

    // save the profile
    const profile = await saveProfile(req.body['profile'])

    // clear the nodecache
    clearProfileCache(user)

    // need to re-log in to update server session
    req.login(user, async (err) => {
      _msg(`[profile/post] [${user['id']}] profile updated`)
		  _sentry.finish()
      return sendData({
        status: true,
        data: profile,
      }, res)
    })

  } catch(err) {
    console.error('[profile/post]', err)
    _err(err)
  }
}





