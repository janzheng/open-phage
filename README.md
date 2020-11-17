# Phages for Global Health: Online

Thanks for checking out the repository for Phages for Global Health: Online! This is the code behind the phage and lab skills course site at online.phagesforglobalhealth.org. We strive to make freely available content for students and researchers interested in getting into bacteriophage research. These instructionals are videos are meant for instructional purposes — please follow all local and state laws when running your experiments.

If you would like us to come teach a course in person, please visit phagesforglobalhealth.org and reach out to Tobi at tobi@phagesforglobalhealth.org


## How this MVP is put together

The project is put-together as a minimal-viable project. We wanted to keep the project 100% free for users, so we needed as many low-cost technologies as we could find to make this possible. The entire project was devised, designed, and developed over the span of 1-2 months. 


### Initial Requirements

"Free and fast" guided our initial project design goals, as the site had to be devised and completed in about 2 months. Additionally, most of Phages for Global Health's work happens in developing nations like Nigeria, where internet connections can be expensive and slow. We decided to optimize for faster load times and reduced bandwidth as much as we could. The reason we decided on videos of lab skills is because they are faster to create, and because lectures and lab techniques are easier to learn as a video.


### Core Technologies

Here are the core technologies and services that help keep PGH:Online as free and accessible as possible:
- Front-end app built on [Svelte/Sapper](https://svelte.dev) and packaged by Rollup
- The serverless server-side runs on [Polka](https://github.com/lukeed/polka) (a simple variant of Express)
- Deployed on vercel.com as a serverless micro-site
- Accounts and site content is managed by [Airtable](https://airtable.com) (passwords and tokens are hashed with bcrypt)
- Lecture content is managed by Notion [Notion](https://notion.so) and uses https://github.com/benborgers/potion to connect to Notion as a CMS
- Transactional emails are handled by [Mailgun](https://mailgun.com)
- Comments handled by [FaunaDB](https://fauna.com)

The main reason we are using services like Notion and Airtable (instead of say, Netlify CMS or MongoDB Atlas) is so content and accounts can fit into tools and workflows that our collaborators are already used to using. Because we lack technical users, sticking with the most familiar tools was emphasized throughout the project. We recognize that Airtable has weak API rates and lacks security mechanisms for accounts (as compared to MongoDB or FaunaDB), we opted to store as little PID as possible while using Airtable as a way to reduce development time.



## Thanks & Credits

This project wouldn't be possible without funding from Mozilla Foundation's. Thanks for helping fund audacious projects in open science and open source, and making experiments like this possible!

This project is coordinated by the non-profit organization, [Phages for Global Health](phagesforglobalhealth.org) and is built by [Phage Directory](https://phage.directory)


## Bugs and feedback

PGH:Online is constantly receiving updates and improvements. Please let us know if you encounter bugs, security issues, or want feature improvements. Please create an issue or reach out to Jan at jan@phage.directory.


## Setting this up for yourself

- Clone this repository
- Run `yarn install`
- (Write up TODO)
  - (TODO) Set up your Notion environment (for main course content)
  - (TODO) Set up your Airtable environment (for accounts and site content)
  - (TODO) Set up your Mailgun environment (if you need account emails)
  - (TODO) Set up your FaunaDB environment (if you need comments) 
  - Set up .env file