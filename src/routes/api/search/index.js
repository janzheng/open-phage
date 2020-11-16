
// logs into fauna
import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"
import { sendData } from "../../../_utils/sapper-helpers" 
import { saveSetup, save } from '../../../_utils/save.js'



config(); // https://github.com/sveltejs/sapper/issues/122

let json

const apiReadKey = process.env.AIRTABLE_ACCOUNTS_API
const apiWriteKey = process.env.AIRTABLE_ACCOUNTS_WRITE_API





export async function getFaveSearch(searchterm, baseId) {


  console.log('searching for fave:', searchterm, baseId)

  const _cachestr = `fave-search-${searchterm}-${baseId}`
  const _cacheObj = cacheGet(_cachestr, false)
  if (_cacheObj)
    return _cacheObj

  // console.log('searching fave:', searchterm, baseId)
  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Faves'],
        options: {
          // "view": view,
          keyword: `${searchterm}`,
          // matchKeywordWithField: 'Slug',
          matchKeywordWithFields: ['Notes','Name','Description','URL','Tags','Publication'],
          matchStyle: 'partial',
          maxRecords: 100, // don't restrict search?
        }
      },
    ],
    routeDetails: '[api/search/getFaveSearch]',
  })

  // attach the baseId to each item for easier saving
  cytosis.results['Faves'].map((f,i) => {
    if(cytosis.results['Faves'][i])
      cytosis.results['Faves'][i]['baseId'] = baseId
  })

  cacheSet( _cachestr, cytosis.results['Faves'] )
  return cytosis.results['Faves']
}


export async function getFavePhid(phid, baseId) {

  const _cachestr = `Fave/search/${phid}-${baseId}`
  if (cacheGet(_cachestr))
    return cacheGet(_cachestr)

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Faves'],
        options: {
          // "view": view,
          keyword: `${phid}`,
          // matchKeywordWithField: 'Slug',
          matchKeywordWithFields: ['Added by'],
          matchStyle: 'exact',
          // maxRecords: 100, // don't restrict phid search?
        }
      },
    ],
    routeDetails: '[api/search/getFavePhid]',
  })


  // doing type search + keyword search in multiple fields is really annoying, so instead we just filter out the types we don't want


  // attach the baseId to each item for easier saving
  cytosis.results['Faves'].map((f,i) => {
    if(cytosis.results['Faves'][i])
      cytosis.results['Faves'][i]['baseId'] = baseId
  })

  cacheSet( _cachestr, cytosis.results['Faves'] )

  return cytosis.results['Faves']
}










// gets a collection based on a slug that looks like basedId-recordId
export const get = async (req, res, next) => {

	const { searchterm } = req.params
	const { bases, addedBy } = req.query

  try {
		let result = [], _bases

    // console.log('searching for...', searchterm, bases, addedBy)

    // search by a user's _phid
    if(addedBy) {
      _bases = bases.split(',').map(async (baseId) => {
        baseId = baseId.trim()
        if(!baseId || baseId.length == 0)
          return 

        const _result = await getFavePhid(addedBy, baseId)
        _result['baseId'] = baseId // helps with saving etc.

        result = [...result, ..._result]
      })
    } else if (searchterm) {
      _bases = bases.split(',').map(async (baseId) => {
        baseId = baseId.trim()
        if(!baseId || baseId.length == 0)
          return 

        const _result = await getFaveSearch(searchterm, baseId)
        _result['baseId'] = baseId // helps with saving etc.

        result = [...result, ..._result]
      })
    }

    await Promise.all(_bases)

      // sort by date created
      result.sort((a,b) => (a.fields['_created'] > b.fields['_created'] ? -1 : a.fields['_created'] < b.fields['_created'] ? 1 : 0))
      
    return sendData({
      status: true,
      data: result,
    }, res, 200)
  } catch(err) {
			console.error('api/search', err)
			throw new Error(err)
  }
}




