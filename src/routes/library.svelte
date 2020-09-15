<script context="module">
  export async function preload(page, session) {
    // const data = await this.fetch(`/api/notion?collections=Protocols,Videos,Library`).then(r => r.json())

    const data = await this.fetch(`/api/notion?contents=Lecture Video, Lab Video, Protocol, Reference, Reading`).then(r => r.json())

    return { data };
  }
</script>




<div class="Library">


  <div class=" _section-page _padding-top-2 _margin-center ">


    <div class=" _margin-center _divider-top _divider-bottom">

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

      <div class="_section _grid-1-3 _divider-top">
        <div>
          <h2 class="_padding-top-none">Readings & Articles</h2>
        </div>
        <div>
          {#if readings}
            {#each readings as item}
              <LinkCard {item} />
            {/each}
          {/if}
        </div>
      </div>

      <div class="_section _grid-1-3 _divider-top">
        <div>
        	<h2 class="_padding-top-none">Useful References</h2>
        </div>
        <div>
        	{#if references}
	        	{#each references as item}
              <LinkCard {item} />
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
              <ProtocolCard protocol={item} />
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

  import ProtocolCard from '../components/ProtocolCard.svelte'
  import LinkCard from '../components/LinkCard.svelte'



  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')


  export let data
  // $: console.log('yotion!!!!!:', data)

  let readings
  $: if(data) readings = [...data['Reading']]

  let references
  // $: if(data) library = [...data['Reference'], ...data['Reading']]
  $: if(data) references = [...data['Reference']]

  let protocols
  $: if(data) protocols = [...data['Protocol']]

  
</script>

<style type="text/scss">

</style>
