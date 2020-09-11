<script context="module">
  export async function preload(page, session) {
    const yotion = await this.fetch(`/api/notion`).then(r => r.json())

    return { yotion };
  }
</script>




<div class="Home">


  <div class="Home-content _section-page _padding-top-2 _margin-center ">
    <div class="_center _section-article _margin-center _divider-top _divider-bottom">

      <div class="_margin-bottom-2"><img alt="Open Phage Flowers Logo" src="/Flowers.png"></div>
      <div>{@html marked(intro || ' [no content]')}</div>

      <!-- <div class="_card _padding">
        <div>{@html marked(subscribe)}</div>
        <Subscribe />
      </div> -->
    </div>
<!-- 
    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(scheduled)}</div>
      <div class="_margin-center _margin-bottom-2">
        {#if upcomingItems && upcomingItems.length > 0}
          {#each upcomingItems as item}
            <UpcomingItem {item}></UpcomingItem>
          {/each}
        {:else}
          <div>{@html marked(noScheduled)}</div>
        {/if}
      </div>
    </div>

    <div class="_section-article _margin-center _divider-top _margin-bottom-2">
      <div>{@html marked(previous)}</div>
      <div class="_margin-center _margin-bottom-2">
        {#if pastItems && pastItems.length > 0}
          {#each pastItems as item}
            <PastItem {item}></PastItem>
          {/each}
        {/if}
      </div>
    </div>


    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(middle)}</div>
    </div>


    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(signup)}</div>
    </div>
    <div class="Home-items">
      {#each Schedule as schedule (schedule.id)}
        <SchedItem {schedule} />
      {/each}
    </div>

    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(end)}</div>
    </div>

    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(organizers)}</div>
    </div>

    <div class="_margin-center _margin-bottom-2">
      {#if organizerProfiles && organizerProfiles.length > 0}
        <div class="_grid-3">
          {#each organizerProfiles as profile}
            <ProfileItem {profile}></ProfileItem>
          {/each}
        </div>
      {/if}
    </div>
 -->
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




  export let yotion

  $: console.log('yotion:', yotion)

  
</script>

<!-- <style type="text/scss">
</style> -->
