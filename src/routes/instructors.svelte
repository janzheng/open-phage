<script context="module">
  export async function preload(page, session) {
    const data = await this.fetch(`/api/notion?content=Instructor`).then(r => r.json())

    return { data };
  }
</script>


<div class="Instructors">

  <div class="_section-page _padding-top-2 _margin-center ">
    <div class="_center _section-article _margin-center _divider-top _divider-bottom">

    	{#each data as profile}
    		<div class="_card _padding">
    			<p>{profile.fields['Name']}</p>
    			<p>{profile.fields['Short']}</p>
    			<p>{profile.fields['Long']}</p>
    			{#if profile.fields['Video'] && profile.fields['Video'][0]}
	    			<video width="640" controls>
						  <source src={profile.fields['Video'][0]} controls="true" type="video/mp4">
						  Your browser does not support the video tag.
						</video>
					{/if}
    		</div>
    	{/each}

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

  // $: console.log('data:', data)

  
</script>

<!-- <style type="text/scss">
</style> -->
