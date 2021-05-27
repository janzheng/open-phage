<script context="module">
  export async function preload(page, session) {
    const yotion = await this.fetch(`/api/notion?collections=Personnel, Lecture Series, Lecture Content, Lab Experiments, Lab Videos&getField=Slug|hero-intro, Slug|hero-course, Slug|contact-home, Slug|org-desc, Slug|pgh-live, Slug|joint-project, Slug|test-block`).then(r => r.json())
    // const yotion = await this.fetch(`/api/notion?content=Block`).then(r => r.json())

    return { yotion };
  }
</script>



<svelte:head>
	<title>PGH|Online</title>
</svelte:head>

<div class="Home"> 

  <div class="Home-hero _section-page _padding-top-2 _margin-center ">

    <div class="Home-body _margin-center _margin-top-2 _divider-bottom _grid-2-1 _grid-gap-large _align-bottom">
      {#if yotion}
        <div class="Home-body-copy">{@html marked(yotion['Slug|hero-intro'][0].content.markdown.join('') || '')}</div>
      {/if}
      <div id="hero-img-container">
        <img class="_margin-left-2-sm" id="hero-img" alt="Checking for plaques" src="/pgh_cover_sm_c.jpg" />
      </div>
    </div>

    <!-- top-bottom -->
    <div class="Home-text _divider-top">
      <!-- {#if yotion}
        <div>{@html marked(yotion['Slug|hero-course'][0].content.markdown.join('') || '')}</div>
      {/if} -->

      <!-- <div class="_margin-top-2 _margin-bottom-2">
        <button class="__action __short">Browse lectures</button>
        <a href="/lectures" class="_button __action __largebtn _font-large">Explore our Phage Course Library</a>
      </div> -->

      <div class="Lectures-body _section _divider-bottom">
        <div class="Lectures-main">
          {#if lectures}
            {#each filteredLectures as item, i}
            <!-- {#each [...filteredLectures.splice(1)] as item, i} -->
              <LectureSummary lecture={item} authors={authors} />
            {/each}
          {/if}
        </div>
      </div>

    </div>
    
  </div>

  <div class="Home-capsid _section-page _padding-top-2 _margin-center ">
    <div class="">
      <CapsidSignup />
    </div>
  </div>

  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <!-- <div class="Home-hero _grid-2"> -->
    <!--<div class="Home-hero">
      <!~~ <div class="Home-logo _center">
        <div class="_margin-bottom-2"><img alt="Open Phage Flowers Logo" src="/Flowers.png"></div>
      </div> ~~>
      <div class="Home-text"> 
        {#if yotion}
          <div>{@html marked(yotion['Slug|hero-intro'][0].content.markdown.join('') || '')}</div>
        {/if}

        <div class="">
          <!~~ <button class="__action __short">Browse lectures</button> ~~>
          <a href="/lectures" class="_button __cta">Browse all lectures</a>
        </div>
      </div>
    </div>-->



    <div class="Home-body _section-article _margin-center _margin-top-2 _divider-bottom">

<!-- 
      <div class="_divider-top">
        {#if yotion && yotion['Slug|test-block']}
          <div>{@html marked(yotion['Slug|test-block'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>
 -->

<!--  
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
          <div>{@html marked(yotion['Slug|org-desc'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div>

      <div class="_divider-top">
        {#if yotion}
          <div>{@html marked(yotion['Slug|contact-home'][0].content.markdown.join('') || '')}</div>
        {/if}
      </div> -->

    </div>

    
  </div>

</div>








<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';
  // import { swr } from '@/swr.js';
  import { onMount, getContext, setContext } from 'svelte';

  import { filterByStatus } from '@/_project/app-helpers'
  import LectureSummary from '../components/LectureSummary.svelte'

  import CapsidSignup from '../components/CapsidSignup.svelte'
  // import { getUser } from '../_utils/auth/get-user';

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro, filteredLectures, authors
	$: intro = Cytosis.findField('intro', Content, 'Content')

  export let yotion
  // $: console.log('Home data::', yotion)

  // $: swr(yotion)


  // $: console.log ('?!?!', yotion['Slug|hero-intro'][0].content.markdown.join(''))

 

 

  let lectures
  $: if(yotion) {

    authors = [...yotion['Personnel']]
    
  	lectures = [...yotion['Lecture Series']]
  	// lectures = lectures.slice(1) // remove first one since it's a "hero"

    // filter out unpublished lectures
    // not that safe but mostly this is to clean up the UI

    filteredLectures = filterByStatus(lectures)

 
    filteredLectures.map(lec => {

      lec['series'] = []
      const contentName = lec.fields['Content ID']
      yotion['Lecture Content'].map(lecItem => {
        if(lecItem.fields['Content ID'] == contentName)
          lec['series'].push(lecItem)
      })

      yotion['Lab Experiments'].map(lecItem => {
        if(lecItem.fields['Content ID'] == contentName)
          lec['series'].push(lecItem)
      })

      yotion['Lab Videos'].map(lecItem => {
        if(lecItem.fields['Content ID'] == contentName)
          lec['series'].push(lecItem)
      })
    })

    // console.log('[lectures]', filteredLectures)
  }
</script>



<style type="text/scss">

</style>