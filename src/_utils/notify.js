

// update 11/5/2020 — nodemailer won't work over Vercel anymore

/*

    mailer.js

    - this is used by the auth templates for signup; acts as an alternative to _mailer which is more for templates
      - probably should unite them at some point
    - based on the old mailer.js, this is a templatized way of sending transactional emails
    - use notify-templates.js to build templates
    - SMTP_USER and SMTP_PASS are both created in Mailgun as SMTP users
      - do NOT use the Mailgun API Key for this; always stick to SMTP users
    
    usage: 
      await notify({
        subject: 'yowwwwza',
        html: template,
        text: template,
        fromName: 'I AM A BANANA!!!',
        to: 'janeazy@gmail.com'
      })


    last updated: 7/30/2020

*/

import mailgun from 'mailgun.js'; // insecure, uses private API, but works better w/ Vercel
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';

let mg

if(process.env.MG_API && process.env.MG_DOMAIN && process.env.MG_SENDER) {
	mg = mailgun.client({
		username: 'api',
	  key: process.env.MG_API, // app.get('smtp').user,
	})
}


let preset = {
  fromName: 'Phage Directory',
  fromEmail: process.env.SMTP_USER,
  replyTo: 'Phage directory',
  replyEmail: 'hello@phage.directory',
  to: 'auto@phage.directory', // comma separated emails
  subject: 'Email subject',
  // html: '<p>Hello World!</p>', // html should be optional
  text: 'Hello World!'
}


export const notifySetup = (data) => {
  preset['fromName'] = data['fromName']
  preset['fromEmail'] = data['fromEmail']
  preset['replyTo'] = data['replyTo']
  preset['replyEmail'] = data['replyEmail']
  preset['to'] = data['to']
  preset['subject'] = data['subject']
  preset['html'] = data['html']
  preset['text'] = data['text']
}

export const notify = async (data) => {
  try {
    const fromName = data['fromName'] || preset['fromName']
    const fromEmail = data['fromEmail'] || preset['fromEmail']
    const replyTo = data['replyTo'] || preset['replyTo']
    const replyEmail = data['replyEmail'] || preset['replyEmail']
    const to = data['to'] || preset['to']
    const subject = data['subject'] || preset['subject']
    const html = data['html'] || preset['html']
    const text = data['text'] || preset['text']

    const mailData = {
      from: `${fromName} <${fromEmail}>`,
      'reply-to': `"${replyTo}" <${replyEmail}>`,
      to: [`${to}`],
      subject: subject,
      html: html,
      text: text,
    }

    // MG_SEND_ON used to deactivate sending from env as a breaker
    if(process.env.MG_SEND_ON !== 'true') {
      console.error('[notify] MG_SEND is turned off')
      // throw new Error('[sendMail] MG_SEND is turned off')
      return
    }
    
    console.log('[notify] Sending using Mailgun to', emailAddr)
    const _msg = await mg.messages.create(process.env.MG_DOMAIN, mailData)
    console.log('[notify] --- Email sent:', _msg, emailAddr);

    return _msg
    
    // return new Promise((resolve) => {
    //   transporter.sendMail(mailData, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response, mailData);
    //       resolve(info.response)
    //     }
    //   });
    // })

  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}





