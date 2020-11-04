
import { prefetch, goto } from '@sapper/app';
import { get } from 'svelte/store';

import { cachet } from './sapper-helpers';
import { fetchPost } from './fetch-helpers';
import { User, Status } from '../stores/stores.js';




// export const handleAddLink = async (data) => {

//   // data: {url, comment}
//   const response = await fetchPost('/api/fave/add', data, fetch)

//   if(response.status == 200) {
//     const results = await response.json()
//     console.log('[addLink]', 'Added!:', results)

// 		let Collections = await cachet({
//       key: 'home-faves',
//       promise: () => (fetch(`api/faves?page=1&size=50`).then(response => response.json())),
//       // swr: true, // avoid triggering immediate refresh on grid
//       refresh: true
//     })

// 		return Collections
//   }
// }


// export const handleDeleteLink = async (fave) => {
//   const data = {
//     cmd: 'DELETE',
//     baseId: fave.baseId,
//     recordId: fave.id
//   }

//   try {
//     console.log('deleting:', data, fave)
//     const response = await fetchPost('/api/fave', data, fetch)

//     if(response.status == 200) {
//       const results = await response.json()
//       console.log('[handleDeleteLink]', 'Deleted:', results)

//       // if(collection) {
//       //   await prefetch(`/faves/${collection}`)
//       //   goto(`/faves/${collection}`)
//       // }

//       await prefetch(`/`)
//       goto('/')
//     }

//   } catch (err) {
//     console.error(err)
//     return
//   }
// }







export const isBookmark = (url) => {
  // console.log('Fave :::', faveId, fave, 'USER favorites:::', $User['Profile']['fields']['Favorites'].includes(faveId),  $User['Profile']['fields']['Favorites'])

  // subscribing to store will cause mem leaks
  const $User = get(User)
  // console.log('[isBookmark]', $User, $User['Profile'])

  if($User && $User['Profile']) { 
    if(!$User['Profile']['fields']['PGH Bookmarks'])
      return false

    return $User['Profile']['fields']['PGH Bookmarks'].includes(url)
  }
  return false
}


// export const getUsersFavorited = async (faveId) => {
//   let result = await fetch(`/api/profile?faveId=${faveId}`).then(response => response.json())
//   return result.data
// }






// did this person add this fave?
// export const isOwner = (fave) => {
//   if(!fave || !fave.fields)
//     return false
  
//   let faveId = `${fave['baseId']}-${fave['id']}`

//   // subscribing to store will cause mem leaks
//   // const $User = get(User)
//   let $User
//   User.subscribe(u=>{$User=u})

//   // console.log('isOwner?! :::', fave.fields['Added by'], 'USER favorites:::', $User)

//   if(User && $User['Profile']) {
//     return (fave.fields['Added by'] === $User['_phid'])
//   }

//   return false
// }



export const handleAddLectureBookmark = async (url) => {
  const $User = get(User)

  if(!$User.id) {
    await prefetch(`/login`)
    goto('/login')
  }

  // check if already a fave
  if (isBookmark(url))
    return true
  
  const data = {
    user: $User,
    url,
  }

  const response = await fetchPost('/api/profile/fave?type=addLectureBookmark', data, fetch)
  const results = await response.json()

  if(results.status == true) {
    User.update(u => {
      u['Profile'].fields['PGH Bookmarks'] = results.data.fields['PGH Bookmarks']
      return u
    }) // update the User store object
  }

  return results
}



export const handleRemoveLectureBookmark = async (url) => {

  // check if already bookmarked
  if (!isBookmark(url))
    return true

  const $User = get(User)

  const data = {
    user: $User,
    url,
  }

  const response = await fetchPost('/api/profile/fave?type=removeLectureBookmark', data, fetch)
  const results = await response.json()

  if(results.status == true) {
    User.update(u => {
      u['Profile'].fields['PGH Bookmarks'] = results.data.fields['PGH Bookmarks']
      return u
    }) // update the User store object

    console.log('REMOVE USER STATE :::', $User)
  }

  return results
}






export const handleAddFavorite = async (fave) => {
  const $User = get(User)

  if(!$User.id) {
    await prefetch(`/login`)
    goto('/login')
  }

  // check if already a fave
  if (isFavorite(fave))
    return true

  let faveId = `${fave['baseId']}-${fave['id']}`
  
  const data = {
    user: $User,
    faveId,
  }

  const response = await fetchPost('/api/profile/fave?type=addFave', data, fetch)
  const results = await response.json()

  if(results.status == true) {
    User.update(u => {
      u['Profile'].fields['Favorites'] = results.data.fields['Favorites']
      return u
    }) // update the User store object
  }

  return results
}



export const handleRemoveFavorite = async (fave) => {

  // check if already a fave
  if (!isFavorite(fave))
    return true

  let faveId = `${fave['baseId']}-${fave['id']}`
  const $User = get(User)

  const data = {
    user: $User,
    faveId,
  }

  const response = await fetchPost('/api/profile/fave?type=removeFave', data, fetch)
  const results = await response.json()

  if(results.status == true) {
    User.update(u => {
      u['Profile'].fields['Favorites'] = results.data.fields['Favorites']
      return u
    }) // update the User store object
  }

  return results
}




// take an array, if it has fields.Status:
// - if current status is Published, only let through Status==Published
// - if current status is Preview, let through Published|Preview
// - if it doesn't have fields it won't be let through
// returns an array
export const filterByStatus = (arr) => {
  let status = get(Status)
  let _arr = arr.filter(d => {
    if(status == 'Published' && d.fields['Status'] == 'Published')
      return d
    else if (status == 'Preview' && (d.fields['Status']=='Preview' || d.fields['Status']=='Published'))
      return d
  })
  // console.log('filterByStatus Status:', status, _arr)
  return _arr
}





// export const handleFaveUpdate = async (event, fave) => {
//   if(event)
//     event.preventDefault()

//   const data = {
//     cmd: 'SAVE',
//     baseId: fave.baseId,
//     recordId: fave.id,
//     payload: {
//       Name: fave.fields['Name'],
//       Notes: fave.fields['Notes'],
//       URL: fave.fields['URL'],
//     }
//   }

//   try {

//     const response = await fetchPost('/api/fave', data, fetch)

//     if(response.status == 200) {
//       const results = await response.json()
//       console.log('[handleFaveUpdate]', 'Saved:', results)

//       // update the collections
//       let Collections = await cachet({
//         key: 'home-faves',
//         promise: () => (fetch(`api/faves`).then(response => response.json())),
//         swr: true,
//       })

//       return results
//     }

//   } catch (err) {
//     isSaving = false
//     console.error(err)
//     return
//   }
// }


















// export const handleDelete = async (event) => {
//   event.preventDefault()
//   isSaving = true

//   const data = {
//     cmd: 'DELETE',
//     baseId,
//     recordId: fave.id
//   }

//   try {

//     console.log('deleting:', data, fave)
//     const response = await fetchPost('/api/fave', data, fetch)

//     if(response.status == 200) {
//       isSaving = false
//       const results = await response.json()
//       console.log('[handleDelete]', 'Deleted:', results)

//       if(collection) {
//         await prefetch(`/faves/${collection}`)
//         goto(`/faves/${collection}`)
//       }

//       await prefetch(`/`)
//       goto('/')
//     }

//   } catch (err) {
//     isSaving = false
//     console.error(err)
//     return
//   }
// }




