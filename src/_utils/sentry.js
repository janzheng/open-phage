/*

setup for sentry error tracking
https://docs.sentry.io/platforms/node/
https://sentry.io/jan-zheng/test-project/getting-started/node/

last updated: 11/19/2020

*/


/* 
  const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
  });

  setTimeout(() => {
    try {
      foo();
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);

*/

/* 
  try {
    // ...
  } catch (e) {
    Sentry.captureException(e);
  }
*/

/* 
  Sentry.captureMessage("Something went wrong");
*/
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

// Sentry will fail silently if not initialized, so if it's not setup, no problem
export const isInit = () => {
  if(Sentry && process.env.SENTRY && Sentry.getCurrentHub().getClient())
    return true
  return false
}

const init = () => {
  if(!isInit())
    Sentry.init({
      dsn: process.env.SENTRY,
      // tracesSampleRate: 1.0, // 1 = every transaction recorded; 0.2 = 20% (default)
    })
  return
}

// export let _sentry = init()

// create setup and create a transaction
// make sure to close it at the end of scope w/ transaction.finish()
export const _tr = (op,name) => {
  init()
  return Sentry.startTransaction({
    op, name
  })
}

// capture a simple error
export const _err = (err, loud=false) => {
  init()
  if(loud){console.error('[sentry/_err] sending error:', err)}
  Sentry.captureException(err)
}

// capture a message
export const _msg = (msg,loud=false) => {
  init()
  if(loud){console.log('[sentry/_msg] messaging:', msg)}
  Sentry.captureMessage(msg)
}





// https://docs.sentry.io/platforms/node/performance/
// useful for tracking api calls