<script context="module">
  export async function preload(page, session) {
    const data = await this.fetch(`/api/notion?collection=Personnel`).then(r => r.json())

    return { data };
  }
</script>


<div class="Team">


  <div class="_section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _divider-top _divider-bottom">

      <h1>Team Members</h1>

    	{#each data as profile}
    		<TeamCard {profile} />
    	{/each}

    </div>
  </div>
</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import { onMount, getContext, setContext } from 'svelte';
  import TeamCard from '../components/TeamCard.svelte'

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')




  export let data

  $: console.log('[team] data:', data)

  
</script>

<style type="text/scss">

</style>
