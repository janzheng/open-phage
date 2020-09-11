
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


