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
    		<div class="_card _padding">
          <div class="_grid-1-4">
            <div>
              {#if profile.fields['Profile Image']}
                <div><img class="profile-img" src={profile.fields['Profile Image'][0]} alt={`${profile.fields['Name']} profile image`}></div>
              {/if}
            </div>
            <div>
              <h3>{profile.fields['Name']}</h3>
              <p><em>{profile.fields['Content Types'].join(',')}</em></p>
              <p>{profile.fields['Short']}</p>
              <p>{profile.fields['Long']}</p>
            </div>

          </div>
    			{#if profile.fields['Video'] && profile.fields['Video'][0]}
            <Video video={profile.fields['Video'][0]} />
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
  import Video from '../components/Video.svelte'

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')




  export let data

  $: console.log('[team] data:', data)

  
</script>

<style type="text/scss">

  .profile-img {
    width: 100%;
    max-width: 150px;
    border-radius: 100%;

  }
</style>
