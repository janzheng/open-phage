
<script context="module">
  export async function preload(page, session) {
    const Content = await this.fetch(`/api/content`).then(r => r.json())
    // const Content = cytosis.results['Content']
    // console.log('_layout Content:', Content)
		return { Content, Status: process.env.STATUS,
			gaOn: (process.env.GA4_ON === 'true'),
			gaId: process.env.GA4_ID, 
			gaDebug: (process.env.GA4_DEBUG === 'true'), 
		};
  }
</script>


<script>
  import { getContext, onMount, tick } from 'svelte';
	import { goto, stores } from '@sapper/app';

	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	import { head, site_url } from '../_utils/head.js';
	import * as Stores from '../stores/stores.js';

	export let gaOn, gaId, gaDebug

  import { derived } from 'svelte/store';
  const { preloading } = stores();

	// This trick passes down preloaded data to all modules
	// https://stackoverflow.com/questions/60911171/how-to-pass-data-from-a-layout-to-a-page-in-sapper
	export let segment
	export let Content, Status

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  const Content$ = writable(Content)
  // const Schedule$ = writable(Schedule)
  // const Profiles$ = writable(Profiles)
  // this updates the store's value when `segment` changes
  // syntactic sugar for: segment$.set(segment)
  $: $Content$ = Content
  // $: $Schedule$ = Schedule
  // $: $Profiles$ = Profiles
	setContext('Content', Content$)
	
	$: {
		Stores.Content.set($Content$)
		Stores.Status.set(Status)
	}




	// check user existence and persist in store?
	// TODO: not sure if this is secure, but it skips a server check
	import { User } from '../stores/stores.js';
	import { getUser } from '../_utils/auth/get-user';
	let user = User
	setContext('User', User) // Context tied to store, which will update accordingly
	// $: console.log('_layout User:::', $User)

	// load and set user object whenever it's loaded
	onMount(() => {
		getUser() // this will set the store reactively
	})



	// don't forget to setup script in template.html
	// ex: script async src="https://www.googletagmanager.com/gtag/js?id=G-07MW60TJNJ" 
	import { _set, _gatrack } from '../_utils/gtag.js';
	if (process.browser && gaOn && gaId) {
		window.dataLayer = window.dataLayer || [];
		function gtag() { dataLayer.push(arguments); }
		gtag('js', new Date());
		gtag('config', gaId, {'debug_mode':gaDebug});
		_set(gtag)
	}
</script>


<svelte:head>
	{#if head}
		<title>{ head.title }</title>

		{#if head.link}
			{#each head.meta as meta}
				<meta 
					charset={meta.charset}
					data-hid={meta.hid} 
					name={meta.name} 
					content={meta.content} 
					property={meta.property} 
				>
			{/each}
			{#each head.link as link}
				<link data-hid={link.hid} rel={link.rel} href={link.href}>
			{/each}
		{/if}

	{/if}
</svelte:head>



<span id="top"></span>
<div class="ContentFrame Layout">

	<!-- {#if $preloading} -->
	  <!-- Show Loading spinner -->
	  <!-- LOADING LOADING -->
		<div class="__loadingbar">
		  <div class="line"></div>
		  <div class="subline inc"></div>
		  <div class="subline dec"></div>
		</div>
	<!-- {/if} -->


	<Nav {segment}/>
	

	<main id="main" class="ContentFrame-body __content-frame">
		<slot ></slot>
	</main>

	<Footer {Content}></Footer>
</div>






<style type="text/scss">

</style>


