

// // ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// // 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // // routes/blog/[slug].json.js
// // import db from './_database.js'; // the underscore tells Sapper this isn't a route

// // export async function get(req, res, next) {
// // 	// the `slug` parameter is available because this file
// // 	// is called [slug].json.js
// // 	const { slug } = req.params;

// // 	const article = await db.get(slug);

// // 	if (article !== null) {
// // 		res.setHeader('Content-Type', 'application/json');
// // 		res.end(JSON.stringify(article));
// // 	} else {
// // 		next();
// // 	}
// // }

// import send from '@polka/send';
// import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import NodeCache from 'node-cache'

// import { config } from "dotenv";

// import { automailer } from '../_utils/mailer.js'

// config(); // https://github.com/sveltejs/sapper/issues/122


// const nodecache = new NodeCache();
// let json;

// export function get(req, res) {

//   const cache = nodecache.get( `seminars` )
//   if(cache) {
//   	console.log('[cytosis] seminar cache')
// 		json = JSON.stringify(cache)
// 		send(res, 200, json, {
// 			'Content-Type': 'application/json'
// 		})
// 		return
//   }

// 	try {
// 	  let bases = [{
// 		  tables: ["Content"],
// 		  options: {
// 		    "view": "Published",
// 		  }
// 	  },{
// 		  tables: ["Schedule"],
// 		  options: {
// 		    "view": "Published",
// 		  }
// 	  },{
// 		  tables: ["Profiles"],
// 		  options: {
// 		    "view": "Published",
// 		  }
// 	  }
// 	  ]

// 		const { slug } = req.params;

// 		// console.log('loading cytosis...', bases)

// 		const apiEditorKey = process.env.P2050_AIRTABLE_PUBLIC_API
// 		const baseId = process.env.P2050_AIRTABLE_PUBLIC_BASE

// 	  let _cytosis = new Cytosis({
// 	    apiKey: apiEditorKey,
// 	    baseId: baseId,
// 	    bases: 	bases,
// 	    routeDetails: '[pdseminar/get]',
// 	  })


// 	  _cytosis.then((_result) => {

// 	  	delete _result['apiKey']
// 	  	delete _result['baseId']

// 	  	const schedule = _result.results['Schedule']
// 	  	schedule.map((sched) => {
// 	  		delete sched.fields['Presenter Email']
// 	  	})

//       nodecache.set( `seminars`, _result, 60*60 );

// 			json = JSON.stringify(_result)
// 			send(res, 200, json, {
// 				'Content-Type': 'application/json'
// 			});
// 	  })
// 	} catch(err) {
// 		throw new Error('[pdseminar/get] Error', err)
// 	}
// }






// export function post(req, res) {

// 	res.writeHead(200, { 'Content-Type': 'application/json' })
// 	// json = JSON.stringify(req.body)
// 	json = req.body // JSON.parse(json)

// 	const apiEditorKey = process.env.P2050_AIRTABLE_PUBLIC_API
// 	const baseId = process.env.P2050_AIRTABLE_PUBLIC_BASE

// 	// console.log(' >>>>>> json >>>', json, json.email, apiEditorKey, baseId)


// 	// validate?

//   const saveToCytosis = async () => {
//     await Cytosis.save({
//       apiKey: apiEditorKey,
//       baseId: baseId,
//       tableName: 'Schedule',
//       tableOptions: {
//         // insertOptions: ['typecast'],
//       },
//       payload: {
//       	'Name': json.schedule.fields['Name'],
//       	'Date': new Date(json.schedule.fields['Date']),
//       	'Presenter Name': json.name,
//         'Presenter Email': json.email,
//         'Topic': json.topic,
//         'Status': 'Awaiting Approval',
//       }
//     })
//   }

//   saveToCytosis().then(async (_res) => {
//   	console.log('saveToCytosis >>> ', _res)

//   	if(json.mailer && json.mailer.send) {
// 	  	try {
// 				const mail = automailer(json.mailer)
// 			  .then(function (response) {
// 			    // console.log(response);
// 					res.end('post completed, email sent!')
// 			  })
// 	  	} catch(err) {
// 	  		console.error('mail error:', err)
// 	  	}
//   	}

// 		res.end('post completed, email sent!')
//   })

// }



// 	// export async function preload(page, session) {

// 	//   let bases = [{
// 	// 	  tables: ["Site Content"],
// 	// 	  options: {
// 	// 	    "view": "content-2--view",
// 	// 	    "maxRecords": 1
// 	// 	  }
// 	//   }]

// 	// 	const { slug } = page.params;
//  //    let cytosisObject = await new Cytosis({
//  //      apiKey: 'keygfuzbhXK1VShlR',
//  //      baseId: 'appc0M3MdTYATe7RO',
//  //      bases: 	bases,
//  //      routeDetails: 'Demo Five',
//  //    })

// 	// 	return { cytosisObject };

// 	// 	