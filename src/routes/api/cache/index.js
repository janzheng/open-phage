
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







// gets a collection based on a slug that looks like basedId-recordId
export const get = async (req, res, next) => {

	const { cacheslug, type } = req.params

	try {
		if(type==='base')
			cacheClear(`_base-${cacheslug}`)

	  return sendData({status: true}, res, 200)
  } catch(err) {
			console.error('api/cache', err)
			throw new Error(err)
  }
}




// export async function post(req, res) {

// 	try {
// 		const { cmd, baseId, recordId, data } = req.body

// 		// console.log('[api/content] post', type, req.body)
		
// 		if(cmd === 'DELETE') {
// 	    const fave = await deleteFave(req.body)
// 	    return sendData(fave, res)

// 		} else if (cmd === 'SAVE') {
// 	    const fave = await saveFave(req.body)
// 	    return sendData(fave, res)
// 		}
// 	} catch(e) {
// 		console.error('[api/fave]', e)
// 	}
// }






