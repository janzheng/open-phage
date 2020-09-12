<script context="module">
  export async function preload(page, session) {
    // const data = await this.fetch(`/api/notion?collections=Protocols,Videos,Library`).then(r => r.json())

    const data = await this.fetch(`/api/notion?collections=Lecture Series&contents=Welcome, Protocol, Reference, Reading&getField=Lecture Series|Welcome`).then(r => r.json())

    return { data };
  }
</script>




<div class="Lectures">


  <div class=" _section-page _padding-top-2 _margin-center ">


    <div class=" _margin-center _divider-top _divider-bottom">

    	<div>
    		Hero lecture: { heroLecture.title[0][0] }
    	</div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 class="_padding-top-none">Lecture Series</h2>
        </div>
        <div>
        	{#if lectures}
	        	{#each lectures as item}
	        		<div class="_card _padding">
	        			{ item.title[0][0] }
	        		</div>
	        	{/each}
	        {/if}
        </div>
      </div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 class="_padding-top-none">Readings & References</h2>
        </div>
        <div>
        	{#if library}
	        	{#each library as item}
	        		<div class="_card _padding">
	        			{ item.title[0][0] }
	        		</div>
	        	{/each}
	        {/if}
        </div>
      </div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 class="_padding-top-none">Protocols</h2>
        </div>
        <div>
        	{#if protocols}
	        	{#each protocols as item}
	        		<div class="_card _padding">
	        			{ item.title[0][0] }
	        		</div>
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

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')


  export let data
  $: console.log('yotion!!!!!:', data)

  let heroLecture
  $: if(data) heroLecture = data['Lecture Series'][0]

  let lectures
  $: if(data) {
  	lectures = [...data['Lecture Series']]
  	lectures = lectures.slice(1) // remove first one since it's a "hero"
  }

  let library
  $: if(data) {
  	library = [...data['Reference'], ...data['Reading']]
  	library = library.slice(0,4) // only show first four
  }

  let protocols
  $: if(data) {
  	protocols = [...data['Protocol']]
  	protocols = protocols.slice(0,4) // only show first four
  }

  
</script>

<style type="text/scss">

</style>
