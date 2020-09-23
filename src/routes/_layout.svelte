
<script context="module">
  export async function preload(page, session) {
    const Content = await this.fetch(`/api/content`).then(r => r.json())
    // const Content = cytosis.results['Content']
    // console.log('_layout Content:', Content)
    return { Content };
  }
</script>


<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	import { head, site_url } from '../_utils/_head.js';
	// This trick passes down preloaded data to all modules
	// https://stackoverflow.com/questions/60911171/how-to-pass-data-from-a-layout-to-a-page-in-sapper
	export let segment
	export let Content

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


<div id="top" class="ContentFrame Layout">
	<Nav {segment}/>

	<main id="main" class="ContentFrame-body __content-frame">
		<slot ></slot>
	</main>

	<Footer {Content}></Footer>
</div>





<!-- 
<style type="text/scss">
  // // @import '../styles/core';
</style> -->


