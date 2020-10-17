<script context="module">
  export async function preload(page, session) {
    // const data = await this.fetch(`/api/notion?collections=Protocols,Videos,Library`).then(r => r.json())

    const data = await this.fetch(`/api/notion?collections=Lecture Series, Lecture Content, Lab Experiments&contents=Welcome, Protocol, Reference, Reading, Lecture&getField=Content IDs|Welcome`).then(r => r.json())


    const status = await this.fetch(`/api/status`).then(r => r.json())

    return { data, status };
  }
</script>




<div class="Lectures">

  <Breadcrumbs links={[
    {href:'/', name:'Home'},
    {href:'/lectures', name:'Lectures'},
    ]} 
  />


  <div class="Lectures _section-page _padding-top-2 _margin-center ">

    <div class="Lectures-container _margin-center _margin-top-2 ">
 
      <!-- <LectureCard isHero={true} lecture={heroLecture} /> -->

      <div class="Lectures-body _section _divider-bottom">
        <div class="Lectures-main">
          {#if lectures}
            {#each lectures as item, i}
              <LectureCard isHero={i==0} lecture={item} showSeries={true} showMaterial={true} />
            {/each}
          {/if}
        </div>
      </div>



<!-- This shows a sidebar of library and protocol items -->
<!-- 
      <div class="Lectures-body _section _grid-2-1 _grid-gap-large _divider-top _divider-bottom">
        <div class="Lectures-main">
          {#if lectures}
            {#each lectures as item}
              <LectureCard class="_margin-bottom-2" lecture={item} showSeries={true} />
            {/each}
          {/if}
        </div>

        <div class="Lectures-sidebar">
          <h4 class="_padding-top-none">Readings & References</h4>
          <div>
            {#if library}
              {#each library as item}
                <LinkCard class="_margin-bottom-2" {item} />
              {/each}
            {/if}
          </div>
          <h4 class="_divider-top">Protocols</h4>
          <div>
            {#if protocols}
              {#each protocols as item}
              <ProtocolCard class="_margin-bottom-2" protocol={item} />
              {/each}
            {/if}
          </div>
        </div>
      </div>
 -->


    </div>
  </div>

</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';
  import { onMount, getContext, setContext } from 'svelte';

  import LectureCard from '../components/LectureCard.svelte'
  import ProtocolCard from '../components/ProtocolCard.svelte'
  import LinkCard from '../components/LinkCard.svelte'
  import Breadcrumbs from '../components/Breadcrumbs.svelte'

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Content')


  export let data, status
  // $: console.log('yotion!!!!!:', data)

  let heroLecture
  $: if(data) heroLecture = data['Lecture Series'][0]

  let lectures
  $: if(data) {

  	lectures = [...data['Lecture Series']]
  	// lectures = lectures.slice(1) // remove first one since it's a "hero"

    // filter out unpublished lectures
    // not that safe but mostly this is to clean up the UI

    if(status === 'Published')
      lectures = lectures.filter(lec=>lec.fields['Status']==='Published')
    else if(status === 'Published' || status === 'Preview')
      lectures = lectures.filter(lec=>(lec.fields['Status']==='Published' || lec.fields['Status']==='Preview'))
    else
      lectures = []


    lectures.map(lec => {

      lec['series'] = []
      const contentName = lec.fields['Content ID']
      data['Lecture Content'].map(lecItem => {
        if(lecItem.fields['Content ID'] == contentName)
          lec['series'].push(lecItem)
      })

      data['Lab Experiments'].map(lecItem => {
        if(lecItem.fields['Content ID'] == contentName)
          lec['series'].push(lecItem)
      })
    })

    console.log('[lectures]', lectures)
  }

  let library
  $: if(data) {
  	// library = [...data['Reference'], ...data['Reading']]
    library = [...data['Reading']]
  	library = library.slice(0,4) // only show first four
  }

  let protocols
  $: if(data) {
  	protocols = [...data['Protocol']]
  	protocols = protocols.slice(0,4) // only show first four
  }

  
</script>
