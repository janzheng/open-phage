

import { siteObject } from '../stores/stores.js';
import { cacheClear, getCacheKeys } from './cache.js';


// scoped variables
let _this = {}
let _origin = ''
let _url = ''
let _urlObj = ''
let _collections = ''
let _title = ''


export const handleBookmarklet = function() {
  _urlObj = new URL(window.location)
  _origin = _urlObj.searchParams.get("origin")
  _url = _urlObj.searchParams.get("url")
  _collections = _urlObj.searchParams.get("collections")
  _title = _urlObj.searchParams.get("title")
  // the origin determines where to send the handshake message, and where to receive the final content from
  // it needs to be the same as the bookmarklet

  console.log('handleBookmarklet', _urlObj, _origin, _url, _title, _collections)

  try {
    // bookmarklet
    if(window.opener) {
      console.log('window opener opened', _origin)
      window.addEventListener("message", receiveBookmarkletData, false) // listen for messages from the parent.
      window.opener.postMessage("loaded", _origin) // signal the parent that we're loaded.
      // }, false)
    } else {
      console.error('Not a bookmarklet call or no window.opener', window)
      // not a bookmarklet call
    }
  } catch(e) {
    console.error('No window found', e)
  }
}

// Adding a new link has been moved out of the faveletApp (too crowded)
// listener to bookmarklet
// only works client-side — make sure to call onMount or onCreate
function receiveBookmarkletData(event) {
  // Do we trust the sender of this message? 
  // the origin should always be from the calling domain (though that doesn’t necessarily make it more safe)
  // console.log('message event:' , event)
  // the 'handshake' message filters out other stuff from vue, grammarly, etc

  console.log('receiveBookmarkletData handler:', event)
  // reminder: if you send data, json will break b/c data too big, so must send as plain text
  if (event.origin !== _origin || !event.data) // || event.data.handshake != 'favlet_handshake')
    return;

  console.log('--- receiveBookmarkletData:', event.data, event.origin)

  // let data = event.data
  let data = unescape(event.data)

  // console.log('>>> updatedData', data)
  // strip the scripts, iframes and styles for size reasons (esp. inline scripts and styles are annoying)
  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  while (SCRIPT_REGEX.test(data)) {
    data = data.replace(SCRIPT_REGEX, "");
  }
  
  var STYLE_REGEX = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
  while (STYLE_REGEX.test(data)) {
    data = data.replace(STYLE_REGEX, "");
  }
  
  var IFRAME_REGEX = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
  while (IFRAME_REGEX.test(data)) {
    data = data.replace(IFRAME_REGEX, "");
  }

  console.log('!!! filteredData', data)

  const dataObj = {raw: {
    urlObj: _urlObj,
    data: data,
    origin: _origin, 
    url: _url,
    collections: _collections,
  }}


  siteObject.set(dataObj)

  console.log('setting ....!!! dataObj', dataObj)

  // save all the raw bookmarklet data for later
  // _this.$store.dispatch('updateCreate', {raw: {
  //   urlObj: _urlObj,
  //   data: data,
  //   origin: _origin, 
  //   url: _url,
  //   collections: _collections,
  // }})

  // _this.$store.dispatch('update', {system: {..._this.$store.state.system, raw: _this.$store.state.system.states.READY}})
}










