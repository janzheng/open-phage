
/* 

  Helpers for front-and-backend that pulls settings from Cytosis
  - details will depend on implementation

*/


import { get } from 'svelte/store';
import Cytosis from 'cytosis'
import { getCytosis } from "../_utils/get-cytosis"

let cytosis
try {
	cytosis = require('../../../static/data/cytosis.json')
} catch(e) {
	// do nothing if file doesn't exist
}


let useContentCache = !process.env.CYTOSIS_LIVE

// node server
// helper that returns a 'setting-' record in Cytosis
// settings return whatever is in the "Value" field
export const getSetting = async (setting, collectionName='Content', compare=true, val='On') => {

  // cytosis content grabbed at compile time from loader
  let collection
  if(useContentCache && cytosis && cytosis.results['Content']) {
    collection = cytosis.results[collectionName]
  } else {
    let _cytosis = await getCytosis({})
    collection = _cytosis.results[collectionName]
  }
  
  if(cytosis && collection) {
    let _setting = Cytosis.findOne(`settings-${setting}`, collection )
    
    if(_setting && _setting.fields && compare) 
      return _setting.fields['Value'] === val

    if(_setting && _setting.fields)
      return _setting.fields['Value']
  }
  return false
}



// sapper client
// helper that returns a 'setting-' record in Cytosis
// settings return whatever is in the "Value" field
export const getSettingClient = (setting, store, compare=true, val='On') => {

  // cytosis content grabbed at compile time from loader
  let collection = get(store)
  
  if(collection) {
    let _setting = Cytosis.findOne(`settings-${setting}`, collection )
    
    if(_setting && _setting.fields && compare) 
      return _setting.fields['Value'] === val

    if(_setting && _setting.fields)
      return _setting.fields['Value']
  }
  return false
}

