import { writable } from 'svelte/store';

export const Content = writable({});


// not used for openphage, added for compat
export const siteObject = writable({});



// storing the user in a store object
// cons: security / data leakage
// pros: testability, reactivity, code reduction
export const User = writable({
	'__isLoading': true 
	// used to check for existence / if it's loaded or not; 
	// failed attempts will return status: false 
});
