
// import Mailgun from 'mailgun.js'; // insecure, uses private API

import nodemailer from 'nodemailer'
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';

import { subscribeTemplate, signupTemplate, adminTemplate  } from "./_email-templates.js"

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // app.get('smtp').user,
    pass: process.env.SMTP_PASS, // app.get('smtp').pass
  }
});



export const notifyAdmins =  async ({registered, type, json}) => {

	try {
		const html = await adminTemplate(registered, type, json)

		const mailData = {
	    from: `${'PHAVES'} <${process.env.SMTP_USER}>`,
		  'reply-to': "\"PHAVES\" <phaves@phage.directory>",
	    to: [`${process.env.NOTIFY_ADMINS}`],
	    subject: `[Auto] PHAVES ${type}!`,
	    html: html,
	    text: html,
		};


		transporter.sendMail(mailData, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		    return true
		  }
		});

	} catch (e) {
		console.error(e)
	}
}



// notify subscribers
export const notifySubscribe = async ({registered, type}) => {

	try {
		const html = await subscribeTemplate(registered, type)

		const mailData = {
	    from: `${'PHAVES'} <${process.env.SMTP_USER}>`,
		  'reply-to': "\"PHAVES\" <phaves@phage.directory>",
	    to: [`${registered.fields['Email']}`],
	    subject: `Subscribed to PHAVES!`,
	    html: html,
	    text: html,
		};


		transporter.sendMail(mailData, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response + ' ' + registered.fields['Email']);
		    return true
		  }
		});

	} catch (e) {
		console.error(e)
	}
}



// notify event signups
export const notifyEventSignup = async ({registered, type, json}) => {

	try {
		const html = await signupTemplate(registered, type, json)

		const mailData = {
	    from: `${'PHAVES'} <${process.env.SMTP_USER}>`,
		  'reply-to': "\"PHAVES\" <phaves@phage.directory>",
	    to: [`${registered.fields['Email']}`],
	    subject: `Signed up for PHAVES event!`,
	    html: html,
	    text: html,
		};


		transporter.sendMail(mailData, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response + ' ' + registered.fields['Email']);
		    return true
		  }
		});

	} catch (e) {
		console.error(e)
	}
}















// var transporter = nodemailer.createTransport({
//   host: "smtp.mailgun.org",
//   secure: true,
//   auth: {
//     user: process.env.P2050_SMTP_USER, // app.get('smtp').user,
//     pass: process.env.P2050_SMTP_PASS, // app.get('smtp').pass
//   }
// });

// var mailOptions = {
//   from: "\"PHAVES\" <phaves@mail.phage.directory>",
//   'reply-to': "\"PHAVES\" <support@phage.directory>",
//   to: 'phaves@phage.directory',
//   subject: 'Sending Email using Node.js',
//   // html: "<h1>That was easy!</h1>",
//   text: 'That was easy!'
// };



// export async function automailer(mailer) {

// 	const mailData = mailer || mailOptions

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.P2050_SMTP_USER, process.env.P2050_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }




// export async function notifySubscribe(mailer) {

// 	const mailData = mailOptions
// 	mailData['to'] = 'useremail'
// 	mailData['subject'] = 'Subscribed to PHAVES!'
// 	mailData['text'] = 'Subscribed to PHAVES!'

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.P2050_SMTP_USER, process.env.P2050_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }




// export async function notifyEventSignup(mailer) {

// 	const mailData = mailer || mailOptions

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.P2050_SMTP_USER, process.env.P2050_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }






