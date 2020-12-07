<script context="module">
  export async function preload(page, session) {
    const data = await this.fetch(`/api/notion?collection=Personnel`).then(r => r.json())

    let authorSlugs=''

    let _data = data.map(d => {
      authorSlugs += d.fields['Slug'] + ', '
    })

    let authorTeachings = await this.fetch(`/api/notion?getAuthorItems=${authorSlugs}`).then(r => r.json())
    return { data, authorTeachings };
  }
</script>



<svelte:head>
	<title>The Team</title>
</svelte:head>


<div class="Team">

  <div class="_section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _divider-top _divider-bottom">

      <h1>Team Members</h1>

    	{#each filterData as profile}
    		<TeamCard {profile} teachings={authorTeachings[profile.fields['Slug']]} />
    	{/each}

    </div>
  </div>
</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import { onMount, getContext, setContext } from 'svelte'
  import TeamCard from '../components/TeamCard.svelte'
  import { Status } from '../stores/stores.js'
  import { filterByStatus } from '@/_utils/app-helpers'

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')

  export let data, filterData, authorTeachings

  $: {
    filterData = filterByStatus(data)
    // console.log('Status:', $Status)
  }

  // $: console.log('[Team] data:', data, authorTeachings)

  
</script>

<style type="text/scss">

</style>
