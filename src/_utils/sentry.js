/*

setup for sentry error tracking
https://docs.sentry.io/platforms/node/

last updated: 11/17/2020

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

const sentryUrl = process.env.SENTRY

Sentry.init({
  dsn: sentryUrl,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

export let _sentry = Sentry


// create setup and create a transaction
// make sure to close it at the end of scope w/ transaction.finish()
export const _tr = (op,name) => {
  if(Sentry) {
    return Sentry.startTransaction({
      op, name
    });
  }
  return undefined
}

// capture a simple error
export const _err = (err, loud=false) => {
  if(loud){console.error('[sentry/_err] sending error:', err)}
  Sentry.captureException(err)
}

// capture a message
export const _msg = (msg,loud=false) => {
  if(loud){console.log('[sentry/_msg] messaging:', msg)}
  Sentry.captureMessage(msg)
}





// https://docs.sentry.io/platforms/node/performance/
// useful for tracking api calls