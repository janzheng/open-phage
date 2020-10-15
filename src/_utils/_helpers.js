
export const mdReplace = (text, replacer) => {
	/*
		text: hello {{ name }}
		replacer: {
			name: 'banana!'
		}

		result = "hello banana!"

	*/
  let result = text

  // console.log('replacer::::', text, replacer)
  Object.keys(replacer).map((key) => {
    // let regex = `/\\{\\{\\s*${key}\\s*\\}\\}/g`
    let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    result = replacer[key] ? result.replace(regex, replacer[key]) : ''
    // console.log('replacing result:', key, result, regex)
  })

  // console.log('result::::', result)
  return result
}



export const getNiceAddress = (stripeAddress) => {
  /*
      gets formatted address from Stripe
  */
  return `${stripeAddress.line1 ? stripeAddress.line1 : ''} <br />
          ${stripeAddress.line2 ? stripeAddress.line2 : ''}  <br />
          ${stripeAddress.city ? stripeAddress.city : ''} ${stripeAddress.state ? stripeAddress.state : ''} ${stripeAddress.postal_code ? stripeAddress.postal_code : ''}
          Canada
          `
}






export const timeDifference = function (current, previous) {
  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now'
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago'
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + ' min ago'
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + ' hours ago'
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + ' days ago'
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + ' mo ago'
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + ' years ago'
  }
}

export const timeDifferenceForDate = function (date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()
  return timeDifference(now, updated)
}

export const getTimestamp = function (date) {
  const current = new Date().getTime()
  const previous = new Date(date).getTime()

  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const elapsed = current - previous

  const days = Math.round(elapsed / milliSecondsPerDay)
  if (days < 4)
    return timeDifferenceForDate(date)
  return new Date(date).toLocaleDateString()
}




export const copyToClipboard = function(text) {
  console.log('copytoclip:', text)
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("value", text);
  document.body.appendChild(input);

  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}


// listener is in the store
// usage: debug(<component>, 'things you want to say')
// usage: debug('someNameHere', 'things you want to say')
export const debug = function(nameObj,...logs) {
  let name = nameObj.name ? nameObj.name : nameObj // could be a component object
  const evt = new CustomEvent('debug', {detail: { name, logs: {...logs} }})
  window.dispatchEvent(evt)
}




/*
  Equivalent of the Airtable slugifier code used for the Slug fields

*/
export const sluggerate = (str) => {
  str = str.trim()
  str = str.toLowerCase()
  str = str.replace(/á/g, "a")
  str = str.replace(/à/g, "a")
  str = str.replace(/â/g, "a")
  str = str.replace(/ä/g, "a")
  str = str.replace(/å/g, "a")
  str = str.replace(/æ/g, "ae")
  str = str.replace(/ç/g, "c")
  str = str.replace(/è/g, "e")
  str = str.replace(/é/g, "e")
  str = str.replace(/ë/g, "e")
  str = str.replace(/ê/g, "e")
  str = str.replace(/î/g, "i")
  str = str.replace(/ï/g, "i")
  str = str.replace(/ì/g, "i")
  str = str.replace(/ñ/g, "n")
  console.log('sluggerating:', str)
  str = str.replace(/ô/g, "o")
  str = str.replace(/ö/g, "o")
  str = str.replace(/ò/g, "o")
  str = str.replace(/ø/g, "o")
  str = str.replace(/õ/g, "o")
  str = str.replace(/ù/g, "u")
  str = str.replace(/û/g, "u")
  str = str.replace(/ü/g, "u")
  str = str.replace(/ý/g, "y")
  str = str.replace(/ /g, "-")
  str = str.replace(/!/g, "-")
  str = str.replace(/\./g, "-")
  str = str.replace(/\//g, "-")
  str = str.replace(/\"/g, "-")
  str = str.replace(/#/g, "-")
  str = str.replace(/\$/g, "-")
  str = str.replace(/%/g, "-")
  str = str.replace(/&/g, "-")
  str = str.replace(/'/g, "-")
  str = str.replace(/\(/g, "")
  str = str.replace(/\)/g, "")
  str = str.replace(/\*/g, "-")
  str = str.replace(/\+/g, "-")
  str = str.replace(/,/g, "-")
  str = str.replace(/:/g, "-")
  str = str.replace(/;/g, "-")
  str = str.replace(/</g, "-")
  str = str.replace(/=/g, "-")
  str = str.replace(/>/g, "-")
  str = str.replace(/\?/g, "-")
  str = str.replace(/@/g, "-")
  str = str.replace(/\[/g, "")
  str = str.replace(/\\/g, "-")
  str = str.replace(/]/g, "")
  str = str.replace(/\^/g, "-")
  str = str.replace(/_/g, "-")
  str = str.replace(/`/g, "-")
  str = str.replace(/{/g, "")
  str = str.replace(/\|/g, "-")
  str = str.replace(/}/g, "")
  str = str.replace(/~/g, "")
  str = str.replace(/«/g, "")
  str = str.replace(/»/g, "")
  str = str.replace(/€/g, "")
  str = str.replace(/„/g, "")
  str = str.replace(/“/g, "")
  str = str.replace(/-----/g, "-")
  str = str.replace(/-----/g, "-")
  str = str.replace(/----/g, "-")
  str = str.replace(/---/g, "-")
  str = str.replace(/--/g, "-")
  console.log('sluggerating final:', str)
  str = encodeURI(str)

  console.log('sluggerating final:', str)
  return str
}




