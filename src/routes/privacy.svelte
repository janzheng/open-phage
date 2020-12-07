<script context="module">
  export async function preload(page, session) {
    // const data = await this.fetch(`/api/notion?collections=Protocols,Videos,Library`).then(r => r.json())

    const data = await this.fetch(`/api/notion?getField=Name|Privacy Policy`).then(r => r.json())

    return { data };
  }
</script>




<svelte:head>
	<title>Privacy</title>
</svelte:head>

<div class="Lectures">


  <div class=" _section-page _padding-top-2 _margin-center ">
    <div class=" _margin-center _divider-top _divider-bottom">
      {@html marked(content || '') }
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
  // $: console.log('yotion!!!!!:', data)

  let content 
  $: if(data) {
    content = data['Name|Privacy Policy'][0].content.markdown.join('')
    console.log('content:', content)
  }
  
</script>

<style type="text/scss">

</style>
