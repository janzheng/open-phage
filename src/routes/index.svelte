<script context="module">
  export async function preload(page, session) {
    const yotion = await this.fetch(`/api/notion?getField=Slug|hero-intro, Slug|contact-home, Slug|pd-desc, Slug|pgh-live, Slug|joint-project, Slug|test-block`).then(r => r.json())
    // const yotion = await this.fetch(`/api/notion?content=Block`).then(r => r.json())

    return { yotion };
  }
</script>

<div class="Home">


  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div class="Home-hero _grid-2">
      <div class="Home-logo _center">
        <div class="_margin-bottom-2"><img alt="Open Phage Flowers Logo" src="/Flowers.png"></div>
      </div>
      <div class="Home-text">
        {#if yotion}
          <div>{@html marked(yotion['Slug|hero-intro'][0].content.markdown.join('') || '')}</div>
        {/if}

      </div>
    </div>



    <div class="_section-article _margin-center _divider-top _divider-bottom">

      <div class="_divider-top">
        [Capsid & Tail sign up here]
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|test-block'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|joint-project'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|pgh-live'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|pd-desc'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|contact-home'][0].content.markdown.join('') || '')}</div>
        {/if}
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

  export let yotion
  $: console.log('Home data::', yotion)

  
</script>

<style type="text/scss">

</style>
