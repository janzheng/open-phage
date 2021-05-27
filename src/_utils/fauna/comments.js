
import { query as q } from 'faunadb'
import faunadb from 'faunadb'

import { findUserById } from '../auth/auth-users'

// import { cacheGet, cacheSet, cacheClear } from "../cache"
import { getSetting } from "@/_project/settings"



export const getComments = async (locId) => {

  if(await getSetting('comments') == false)
    return []

  try {

    console.log('getting comments for:', locId)
    
    if(!process.env.FAUNA_COMMENTS_KEY) {
      console.error('[getComments] No access to Fauna')
      return undefined
    } 

    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })
    let comments
    // console.log('LOC ID GRABBING:', locId)

    if(!locId) {
      comments = []
	    // comments = await client.query(
	    //   q.Map( // array of comments
	    //     q.Paginate(
	    //       q.Match(q.Index(`${process.env.FAUNA_COLLECTION}-all-comments`)),
	    //       { size: 100 }
	    //     ),
	    //     q.Lambda('X',q.Get(q.Var('X')))
	    //   )
	    // )
    } else {
	    comments = await client.query(
	      q.Map( // array of comments
	        q.Paginate(
	          q.Match(q.Index(`${process.env.FAUNA_COLLECTION}-comments-by-location`), locId),
	          { size: 100 }
	        ),
	        q.Lambda('X',q.Get(q.Var('X')))
	      )
	    )
    }

		// const data = await response.json();

    // whitelist
    let newComments = []
    let _newComments = comments.data.map(async (val) => {
      // console.log('messages::::', val)
      let _user = await findUserById(val.data._phid)
      // console.log('----cleaning----', val.data._phid, val.data.comment, _user)

      if(!_user || !_user['Authorizations'] || !_user['Authorizations'].includes('Allow::ShowComments'))
        return

      newComments.push({
        comment: val.data.comment,
        _phid: val.data._phid,
        locId: val.data.locId,
        ts: val.ts,
      })
    })

    await Promise.all(_newComments)
    newComments.sort((a,b) => (a['ts'] - b['ts']))
    // console.log('messages::::', newComments)
    let clean = {data: newComments}

    return clean
  } catch (error) {
    console.error('[getComments] error', error)
  }

}




// locId: (optional) specifies the slug or location of the post (for perma-url)
// user: user info; use _phid to track back to the user
// post: post data (usually a message) 
export const postComment = async (locId, user, comment) => {

  // console.log('getComments getSetting???', await getSetting('comments'))
  if(await getSetting('comments') == false)
    return []

  if(!process.env.FAUNA_COMMENTS_KEY) {
    console.error('[postComment] No access to Fauna')
    return undefined
  } 


  const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })

  // console.log('postComment:', locId, user, comment)

  const data = {
		_phid: user['_phid'],
		comment,
		locId,
  }

  const queryResponse = await client.query(
    q.Create(
    	q.Collection(process.env.FAUNA_COLLECTION),
    	{data} // shape is { data: } — we want the data object in here
    )
  )

  return queryResponse
}




export const getCommentCount = async (locId) => {

  // console.log('getComments getSetting???', await getSetting('comments'))
  if(await getSetting('comments') == false)
    return []

  if(!process.env.FAUNA_COMMENTS_KEY) {
    console.error('[getCommentCount] No access to Fauna')
    return undefined
  } 


  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })
    let count
    // console.log('[Fauna:Comments] Counting:', locId)

    count = await client.query(
      q.Count( // array of comments
        q.Match(q.Index(`${process.env.FAUNA_COLLECTION}-comments-by-location`), locId)
      )
    )
    console.log('[getCommentCount] Count:', count)

    return count
  } catch (error) {
    console.error('[getCommentCount] error', locId, error)
  }
}



export const getCommentCounts = async (locIds) => {

  // console.log('getComments getSetting???', await getSetting('comments'))
  if(await getSetting('comments'))
    return []

  if(!process.env.FAUNA_COMMENTS_KEY) {
    console.error('[getCommentCounts] No access to Fauna')
    return undefined
  } 


  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })
    
    // console.log('[Fauna:Comments] Counting:', locIds)

    let queries = []
    locIds.split(',').map(locId => {
      queries.push(q.Count(q.Match(q.Index(`${process.env.FAUNA_COLLECTION}-comments-by-location`), locId)))
    })

    // an array of all the locIds and their counts
    let counts = await client.query(queries)

    // ex of dynamically inserting many queries:
    // count = await client.query(
    //   [ q.Count( q.Match(q.Index('papersh-comments-by-location'), 'appt2SFxpb8nryVjF-reckCdIntvP7meI3w')), 
    //     q.Count( q.Match(q.Index('papersh-comments-by-location'), 'appt2SFxpb8nryVjF-recbjfspryaAXUDr0'))
    //   ]
    // )

    let countObj = {}

    // zipper the data together into an object that's easy to reference
    locIds.split(',').map((locId,i) => {
      countObj[locId] = counts[i]
    })

    // console.log('[Fauna:Comments] Multiple Count:', countObj)

    return countObj
  } catch (error) {
    console.error('[getCommentCounts] error', error)
  }

}


// lastItemId is the... id of the last item of the page, used for next page
export const getAllComments = async (size=100, lastItemId) => {

  try {

    if(!process.env.FAUNA_COMMENTS_KEY) {
      console.error('[getComments] No access to Fauna')
      return undefined
    } 

    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })
    let comments

    comments = await client.query(
      q.Map( // array of comments
        q.Paginate(
          q.Match(q.Index(`${process.env.FAUNA_COLLECTION}-all-comments`)),
          { size: 100,
            after: lastItemId ? q.Ref(q.Collection(process.env.FAUNA_COLLECTION), lastItemId) : undefined
          }
        ),
        q.Lambda('X',q.Get(q.Var('X')))
      )
    )

    // whitelist
    let newComments = []
    let _newComments = comments.data.map(async (val) => {
      // console.log('messages::::', val)
      // let _user = await findUserById(val.data._phid)
      // // console.log('----cleaning----', val.data._phid, val.data.comment)

      // if(!_user['Authorizations'] || !_user['Authorizations'].includes('Allow::ShowComments'))
      //   return

      
      newComments.push({
        comment: val.data.comment,
        _phid: val.data._phid,
        locId: val.data.locId,
        ts: val.ts,
        ref: val.ref,
      })
    })

    await Promise.all(_newComments)
    newComments.sort((a,b) => (b['ts'] - a['ts']))
    let clean = {data: newComments}

    return clean
  } catch (error) {
    console.error('[getAllComments] error', error)
  }

}




export const deleteComment = async (id) => {

  if(!process.env.FAUNA_COMMENTS_MOD_KEY) {
    console.error('[deleteComment] No access to delete Fauna')
    return undefined
  } 

  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_MOD_KEY })
    console.log('[deleteComment] deleting id:', id)

    let del = await client.query(
      q.Delete(q.Ref(q.Collection(process.env.FAUNA_COLLECTION), id))
    )
    console.log('[deleteComment] delete status:', del)

    return del
  } catch (error) {
    console.error('[deleteComment] error', id, error)
  }
}


// export async function post(req, res, next) {

//   const { sigName, sigMessage, sigPointer } = req.body
//   const secret = req.session.secret

//   try {
    
// 		// const user = await getProfile(secret)
//   	console.log('[messages] creating signature::::', sigName, sigMessage, sigPointer)

//     const client = new faunadb.Client({ secret: process.env.FAUNA_GUESTBOOK_KEY })

//     const data = {
// 			username: sigName,
// 			message: sigMessage,
// 			pointer: sigPointer
//     }
//     const queryResponse = await client.query(
//       q.Create(
//       	q.Collection('Guestbook'),
//       	{data} // shape is { data: } — we want the data object in here
//       )
//     )

//     // const signatureInfo = { name: queryResponse.data.name, message: queryResponse.data.message, _ts: queryResponse.ts, ref: queryResponse.ref}
//  		// console.log('sig info / success!', signatureInfo)

// 		// const data = await response.json();
// 		res.writeHead(200, { 'Content-Type': 'application/json' })
// 		res.end(JSON.stringify(data))

//   } catch (error) {
//     console.error('signature.js create error:', error)
//     res.statusCode = 403
//     res.end()
//     // next(error)
//   }
// }


