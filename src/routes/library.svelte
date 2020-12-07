<script context="module">
  export async function preload(page, session) {
    // const data = await this.fetch(`/api/notion?collections=Protocols,Videos,Library`).then(r => r.json())

    const data = await this.fetch(`/api/notion?contents=Lecture Video, Lab Video, Protocol, Reference, Reading`).then(r => r.json())


    if(data['Protocol']) {
      let _users = data['Protocol'].map(async (d,i) => {
        if(d.fields['Author']) {
          let user = await this.fetch(`/api/notion?getUser=${d.fields['Author']}`).then(r => r.json())
          data['Protocol'][i] = {...data['Protocol'][i], ...user}
        }
      })
      await Promise.all(_users)
    }

    return { data };
  }
</script>



<svelte:head>
	<title>Library</title>
</svelte:head>


<div class="Library">


  <div class=" _section-page _padding-top-2 _margin-center ">

    <div class=" _margin-center _divider-top _divider-bottom">

      <h1>Reference Library</h1>
      <!-- <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 class="_padding-top-none">Videos</h2>
        </div>
        <div>
        	{#if videos}
	        	{#each videos as item}
	        		<div class="_card _padding">
	        			{ item.title[0][0] }
	        		</div>
	        	{/each}
	        {/if}
        </div>
      </div> -->

      <div class="Library-toc _padding _card">
        <h4>Table of Contents</h4>
        <p><a href="#articles">Readings & Articles</a></p>
        <p><a href="#references">Handy References</a></p>
        <p><a href="#protocols">Protocols</a></p>
      </div>



      <div class="_section _grid-1-3 _divider-top">
        <div>
          <h2  id="articles" class="_padding-top-none">Readings & Articles</h2>
        </div>
        <div>
          {#if filteredReadings}
            {#each filteredReadings as item}
              <LinkCard {item} />
            {:else}
              <div class="_card _padding">No readings added yet</div>
	        	{/each}
          {/if}
        </div>
      </div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 id="references" class="_padding-top-none">Handy References</h2>
        </div>
        <div>
        	{#if filteredReferences}
	        	{#each filteredReferences as item}
              <LinkCard {item} />
            {:else}
              <div class="_card _padding">No references added yet</div>
	        	{/each}
	        {/if}
        </div>
      </div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 id="protocols" class="_padding-top-none">Protocols</h2>
        </div>
        <div>
        	{#if filteredProtocols}
	        	{#each filteredProtocols as item}
              <ProtocolCard protocol={item} />
            {:else}
              <div class="_card _padding">No protocols added yet</div>
	        	{/each}
	        {/if}
        </div>
      </div>

    </div>
  </div>

</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';
  import { onMount, getContext, setContext } from 'svelte';
  import { filterByStatus } from '@/_utils/app-helpers'


  import ProtocolCard from '../components/ProtocolCard.svelte'
  import LinkCard from '../components/LinkCard.svelte'



  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')


  export let data
  // $: console.log('[Library]', data)

  let readings
  $: if(data) readings = [...data['Reading']]

  let references
  // $: if(data) library = [...data['Reference'], ...data['Reading']]
  $: if(data) references = [...data['Reference']]

  let protocols
  $: if(data) protocols = [...data['Protocol']]

  let filteredReadings, filteredReferences, filteredProtocols
	$: {
    filteredReadings = filterByStatus(readings)
    filteredReferences = filterByStatus(references)
    filteredProtocols = filterByStatus(protocols)
	}


  // prevents Sapper from hijacking anchor links
  onMount(() => {
    document.querySelectorAll('a').forEach(a => {
      if (!a.hash || !document.querySelectorAll(a.hash).length) return
      a.addEventListener('click', event => {
        event.preventDefault()
        window.location.hash = event.target.getAttribute('href')
        event.target.scrollIntoView()
      })
    })
  })
  
</script>

<style type="text/scss">

</style>
