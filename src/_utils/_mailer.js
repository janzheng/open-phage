
import mailgun from 'mailgun.js'; // insecure, uses private API, but works better w/ Vercel
// import nodemailer from 'nodemailer'
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';


let transporter, mg

export const mailFrom = `${process.env.MG_NAME || 'Phage Directory'} <${process.env.MG_SENDER || process.env.SMTP_USER}>`
export const mailReplyTo = `\"${process.env.MG_NAME}\" <${process.env.MG_REPLYTO || 'hello@phage.directory'}>`
// need to create a new transporter for every call!
// nodemailer doesn't work w/ Vercel (anymore, bc of AWS)

if(process.env.MG_API && process.env.MG_DOMAIN && process.env.MG_SENDER) {
	mg = mailgun.client({
		username: 'api',
	  key: process.env.MG_API, // app.get('smtp').user,
	})
}

// needs to remain not exported!
const sendMail = async (mailData) => {
		let emailAddr = mailData['to']

	// console.log('[sendMail] Attempting to send mail...')

	if(process.env.MG_SEND_LOG !== 'true') {
		if(transporter) {
			console.log('[sendMail] Sending using SMTP to', emailAddr)
		} else if(mg) {
			console.log('[sendMail] Sending using MailgunJS to', emailAddr)
		}
	}

	// MG_SEND_ON used to deactivate sending from env as a breaker
	if(process.env.MG_SEND_ON !== 'true') {
		console.error('[sendMail] MG_SEND is turned off')
		// throw new Error('[sendMail] MG_SEND is turned off')
		return
	}
	
	try {
		if(transporter) {
			// console.log('sending using SMTP to', emailAddr)
			// return transporter.sendMail(mailData, function(error, info){
			//   if (error) {
			//     console.error(error)
			//   } else {
			//     console.log('[sendMail] Email sent: ' + info.response + ' ' + emailAddr);
			//     return Promise.resolve(info)
			//   }
			// });
		} else if (mg) {
			// console.log('sending using Mailgun to', emailAddr, mg.messages, mailData)
			console.log('[sendMail] Sending using Mailgun to', emailAddr)
			const _msg = await mg.messages.create(process.env.MG_DOMAIN, mailData)
	    console.log('[sendMail] --- Email sent:', _msg, emailAddr);
			return _msg
		} else {
			throw new Error('No email method setup!')
			return false
		}
	} catch(e) {
		console.error('[sendMail] error:', e)
		return false
	}
	console.error('[sendMail] Returning false ... email not sent')
	return false
}


/* 

	Customizable notifiers

*/


// keep templating fns out of here — keep this just for admin notifications
export const mailtoAdmins = async (data) => {
	try {
		
		const html = data['html'] || data['template']
		const subject = data['subject'] || data['template'] ? data['template']['subject'] : ''

		const mailData = {
	    from: mailFrom,
		  'reply-to': mailReplyTo,
	    to: [`${process.env.MG_ADMINS}`],
	    subject: `[AutoAdmin] ${process.env.MG_NAME} ${subject}`,
	    html: html,
	    text: html,
		}

		if(process.env.MG_SEND_ADMIN_ON !== 'true')
			return
			
		const res = await sendMail(mailData)
		return res

	} catch (e) {
		console.error(e)
	}
}


// notify subscribers
export const mailto = async (data) => {

	if(!data || !data['email'] || !data['subject'] || !(!data['template'] || !data['html'])){
		console.error('[mailto] error: provide template/html, and email', data)
		// throw new Error('[mailto] error: provide template/html, and email')
		return
	}

	const html = data['html'] || data['template']['html']
	const subject = data['subject'] || data['template'] ? data['template']['subject'] : ''

	try {
		const mailData = {
	    from: mailFrom,
		  'reply-to': mailReplyTo,
	    to: data['email'],
	    subject: subject,
	    html: html,
	    text: html,
		};

		const res = await sendMail(mailData)
		return res

	} catch (e) {
		console.error(e)
	}
}

