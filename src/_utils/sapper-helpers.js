
/*

  Abstract the boring stuff of Sapper / Polka

  
  last update: 10/4/2020

*/

import send from '@polka/send';
// import * as _ from '@polka/redirect'

/*
  json wrapper around send 

  usage:
  
    return sendData({
      status: false,
      message: `Verification token is invalid or has expired.`, 
    }, res)


*/
export async function sendData(data, res, code=200, headers={}) {
  const json = JSON.stringify(data)
  return send(res, code, json, {
    'Content-Type': 'application/json',
    ... headers
  });
}

// kind of dumb, but cleans up imports
export async function redir(res, path='/') {
  return _.redirect(res, path)
}








/*
  localStorage SWR for svelte/sapper

  - use localStorage and sapper store for SWR
  - ttl to restrict grabbing from server
  - if swr = true, we grab results from server to force a data refresh
    - note this triggers the front-end twice
  - the cache keys should be agnostic of framework
  - big difference from Vue 3 is reactivity is tied to the calling component
    - there's no watchEFfect or Reactive, but uses $: reactivity

  **** This returns a sapper store Writeable object!

  usage:


  let info
  $: info = swr({
    key: name,
    promise: () => (fetch(`api/profile?_phid=${_phid}`)
          .then(response => response.json())),
    ),
    ttl: 1000 * 60 * 5, // time for cache to expire
    swr: false, // update the data to replace the store and cache after data has been retrieved
  )

  and 



  inspired by https://dev.to/n0n3br/build-your-own-vue3-swr-hook-4h32

*/




// import { reactive, readonly, toRefs, watchEffect } from "vue"
// import { getContext, setContext } from 'svelte'
import { writable, readable } from 'svelte/store'
import memoize from 'lodash.memoize'
import debounce from 'lodash.debounce'
// import { updatedDiff } from 'deep-object-diff'



// https://github.com/lodash/lodash/issues/2403
// necessary to debounce each calls w/ separate arguments
const memoizeDebounce = (func, wait=0, options={}) => {
  var mem = memoize(function() {
    return debounce(func, wait, options)
  }, options.resolver);
  return function(){mem.apply(this, arguments).apply(this, arguments)}
}


const cache = {} // holds svelte store objects indexed w/ the key 

// this grabs data from server and sets the store reactively
const loadFromServer = (promise, state, key, ttl) => {
  const now = new Date()
  let doContinue = true
  let cacheObj

  // TODO: This is probably causing memory leaks, since not unsubscribing
  // console.log('------$$$ loading....... from server:', key, Object.keys(cache).length)
  let cacheUnsub = cache[key].subscribe(value => {
    // console.log('------$Key value update:', key, value)
    // don't continue loading if the data is already set to loading
    if (value.isLoading)
      doContinue = false

    cacheObj = value
  });

  // console.log('------$$$ loading....... continue:', doContinue)
  if(promise && doContinue) {
    // set new expiry time
    state.expiry = now.getTime() + ttl,
    state.isLoading = true
    cache[key].set(state) // update w/ loading status


    // console.log('CACHET LOADING FROM SERVER', key)
    // execute the fetch task embedded in the promise
    promise().then((response) => {

      // console.log('CACHET LOADING FROM SERVER [finished]', key)
      // console.log('OLDOLDOLDOLDOLD data size:::', JSON.stringify(cacheObj.data).length)
      // console.log('NEWNEWNEWNEWNWE data size:::', JSON.stringify(response).length)

      let oldLen = JSON.stringify(cacheObj.data).length
      let newLen = JSON.stringify(response).length

      // let _diff = updatedDiff(cacheObj.data, response)
      // console.log('diff', oldLen, newLen)


      // TODO / WARN ***
      // This skips an SWR state refresh if object lengths are the same! 
      // This code could lead to bad things; at least stale updates when it should be
      // two objects can have same lengths and be different!
      // doesn't work too well
      // if(oldLen == newLen)
        // return 

      // console.log('[Cachet] Data: ', key, response)

      state.data = response
      state.isLoading = false
      cache[key].set(state)

      localStorage.setItem(`cachet-${key}`, JSON.stringify({
        data: state.data,
        expiry: state.expiry
      }))

      // console.log('------$$$ updated / loaded from server:', key, state)
    })
    .catch((err) => {
      state.isLoading = false
      state.isError = true
      state.error = err.message
      cache[key].set(state)
      console.error(err)
    })
  }

  // done
  cacheUnsub() // unsubscribe from cache key to save mem
}

const debouncedLoader = memoizeDebounce(loadFromServer, 5000, {leading: true})


// cache w/ swr — if exists in cache, grab it; if expired or doesn't exist, grab it
// if past the ttl, grab from source and replace store and localStorage
// swr: return store object first, then update the store object w/ latest data. Will retrigger data / cause refresh
// refresh: ignore all stores and cause a reload; use for data updates and adds
export const cachet = ({key, promise, ttl=1000 * 60 * 5, swr=false, refresh=true}) => {

  // console.log('[cachet] load:', key)

  // only do this on browser, not on server or build
  if(process && process.browser === true) {
    const now = new Date()

    let item = localStorage.getItem(`cachet-${key}`)
                    ? JSON.parse(localStorage.getItem(`cachet-${key}`))
                    : null

    const state = {
      data: item ? item.data : null,
      isLoading: false,
      isError: false,
      error: null,
      expiry: item ? item.expiry : null,
      promise,
    }


    // make cacheVal reactive
    let cacheVal
    if(cache[key]) {
      // TODO: need unsubscribe; causes mem leaks
      cache[key].subscribe(v=>(cacheVal = v))
    }
    
    // const _promise = debounce(promise, 500, {leading: true})
    // console.log('*** cachet running', key, swr, cacheVal && cacheVal.expiry && now.getTime() < cacheVal.expiry)

    // 1. check if exists in memory
    // get from store / object if exists and if not past expiry
    if(!refresh && cacheVal && cacheVal.expiry && now.getTime() < cacheVal.expiry) {
      // console.log('[CACHET] found in memory:', key, cacheVal.expiry)
      if(swr) // refresh the localStorage from the server asynchronously
        debouncedLoader(promise, state, key, ttl)

      return cache[key]
    }

    if(!cache[key])
      cache[key] = writable(state) // create cache[key] w/ the store if it doesn't exist

    // console.log('tiptip', cache[key], state.isLoading, state.data, state.expiry, now.getTime() < state.expiry)


    // 2. check if exists in localStorage
    // if data exists in localStorage and is within expiry
    if (!refresh && state.data && state.expiry && now.getTime() < state.expiry) {
      // console.log('[CACHET] found in localStorage:',key)

      if(swr) // refresh the localStorage from the server asynchronously
        debouncedLoader(promise, state, key, ttl)

      // console.log('taptap')
      return cache[key]
    }


    // console.log('toptop')

    // console.log('[CACHET] retrieving from server:',key)
    // otherwise we get the data, save it to localStorage and cache
    // and return the store item
    debouncedLoader(promise, state, key, ttl)


    // 3. grab fresh
    // store will update after store is returned
    // but store is reactive so that doesn't really matter
    return cache[key]
  

  }

  return undefined
}




