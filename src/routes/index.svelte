<script context="module">
  export async function preload(page, session) {
    const yotion = await this.fetch(`/api/notion`).then(r => r.json())

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
        <div>{@html marked(intro || ' [no content]')}</div>

        <div class="_divider-top">First course intro block</div>

        <div class="_divider-top">
          <button>Start here!</button>
        </div>
      </div>
    </div>



    <div class="_center _section-article _margin-center _divider-top _divider-bottom">

      <div class="_divider-top">
        Capsid & Tail block
      </div>

      <div class="_divider-top">
        Joint Project Description block
      </div>

      <div class="_divider-top">
        PGH Live training block
      </div>

      <div class="_divider-top">
        Phage Directory Block
      </div>

      <div class="_divider-top">
        Contact us Block
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

  $: console.log('yotion:', yotion)

  
</script>

<style type="text/scss">

</style>
