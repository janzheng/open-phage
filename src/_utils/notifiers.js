/* 

  Project-specific mailers

*/


import { mailto } from "../_utils/mailer.js"
import { getTemplate } from "../_utils/project/email-templates.js"


// might be necessary if multiple data sources need same dict
// will need to stay custom - call this with
// buildDict({...dataSrc1, ...dataSrc2, ...dataSrc3})
// export let buildDict = (data)  => {
// 	return {
// 		name: `${data.fields['Name']}`,
// 		email: `[${data.fields['Email']}](${data.fields['Email']})`,
// 		// eventName: data ? json.session.fields['Name'] : ' ',
// 		// time: json ? json.session.fields['Presentation Date'] : '(We will know the exact time and date and let you know)',
// 		// videoLink: json ? json.session.fields['Video Link'] : '(We will send the link in a separate email)',
// 	}
// }


// takes a dictionary object and matches it up with a template, replaces strs like {{name}}
// if dict doesn't exist, can take data and a translator object to build the dictionary
// this is useful to translate things like data.fields.email into dict.email
export const notifyAdmins = async ({data, dict}) => {
	// if(!dict && data) // sometimes the data is the dictionary, but not always true
	// 	dict = buildDict(data, translator)

  // console.log('[notifyAdmins] getting template with ...', data, dict)
  const template = await getTemplate({dict: buildDict(data), templateName:'email-admin'})
  
  // console.log('[notifyAdmins]', data, dict, template)
  console.log('[notifyAdmins]')
  mailtoAdmins({
		subject: template['subject'],
		template
	})
}


export const notifyUserThanks = async ({data, dict}) => {
  // console.log('[notifyUserThanks] getting template with ...', data, dict)
  const template = await getTemplate({dict: buildDict(data), templateName:'email-user'})
  
  console.log('[notifyUserThanks]')
  mailto({
		subject: template['subject'],
		email: data['email'],
		template
	})
}

export const notifyUser = async ({data, dict}) => {
	// dict is mandatory
	// if(!dict && data) // sometimes the data is the dictionary, but not always true
	// 	dict = buildDict(data, translator)

  // console.log('[notifyUser] getting template with ...', dict)
  const template = await getTemplate({dict: buildDict(data), templateName:'email-user-responses'})
  
  // console.log('[notifyUser] template:', template['markdown'])
  console.log('[notifyUser]')
  mailto({
		subject: template['subject'],
		email: data['email'],
		template
	})
}




// export const adminTemplate = async (data, type) => {
// 	// console.log('adminTemplate:', data, type)
// 	const dict = buildDict(data, type)
// 	const template = await getTemplate('email-admin')
// 	const replaced = keyReplace(template, dict)
// 	return marked(replaced)
// }

// export const subscribeTemplate = async (data, type) => {
// 	// console.log('subscribeTemplate:', data, type)
// 	const dict = buildDict(data, type)
// 	const template = await getTemplate('email-subscribe')
// 	const replaced = keyReplace(template, dict)
// 	// console.log('subscribeTemplate:::: template', template, replaced)
// 	return marked(replaced)
// }



// build the dictionary from data for complex objects
// custom to SoP
import { formData } from "@/data/stateofphage.js"
export const buildDict = (data) => {
	let dict = data

	// fix problematic items
	Object.keys(dict).map((key,i) => {
		let item = dict[key]
		let isArray = Array.isArray(item)
		// console.log('item key:', key, i, ' -- ',isArray, isObject, typeof item)

		if(isArray) { // all complex options are arrays
			if(item.length == 0) return 
			// array of strings: radio — find the item nestled in a field somewhere
			// then replace the item values with the labels
			if(typeof item[0] == 'string') {
				let formItem // item in the form w/ labels etc.
				Object.keys(formData).map(fd => {
					if(!formItem && formData[fd].fields && formData[fd].fields.length > 0) {
						formData[fd].fields.map(field => {
							if(field && field.name && field.name == key) {
								formItem = field
							}
						})
					}
				})

				// instead of item-value, item-value-2, turn into labels like Value #1, Value #2
				let itemLabels = []
				item.map(value => {
					let label
					if(formItem.options) {
						let option = formItem.options.find(opt => opt.value == value)
						if(option && option.label) {
							itemLabels.push(option.label)
						} else {
							itemLabels.push(value) // checkinput fill-in-the-blank value
						}
					}
				})

				// console.log('--- handling radio:', key, item, itemLabels)
				// replace with nicer item labels
				dict[key] = itemLabels.join(', ')
			}

			// array of objects: complex objects
			else {
				// these are arrays of objects, where each object's label and value need to be reported
				let itemLabels = []
				if(item.length > 0) {
					item.map(o => {
						// either extract value from the key or from the last item in the object (works for strains etc.)
						// messy object extraction but basically just using object keys to get the last item...
						let str = o[key] ? `${o.label}: ${o[key]}` : `${o.label}: ${o[Object.keys(o)[Object.keys(o).length-1]]}`
						// console.log('lol ...', Object.keys(o)[Object.keys(o).length-1], o[Object.keys(o)[Object.keys(o).length-1]])
						itemLabels.push(str)
					})
				}
				dict[key] = itemLabels.join(', ')
				// console.log('--- handling complex object:', key, item, itemLabels)
			}
		}

	})
	return data
}

