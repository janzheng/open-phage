
<script context="module">
	export async function preload({ params, query }) {
		const slug = params.protocol, ref = `Slug|${params.protocol}`
    const protocol = await this.fetch(`/api/notion?getField=Slug|${params.protocol}`).then(r => r.json())

    if(protocol[ref][0].fields['Author']) {
    	let users = await this.fetch(`/api/notion?getUser=${protocol[ref][0].fields['Author']}`).then(r => r.json())
    	protocol[ref][0] = {...protocol[ref][0], ...users}
    }

		return { protocol: undefined || protocol[ref][0], slug: `protocols-${params.protocol}`};
	}
</script>


<div class="Protocol _section-page _padding-top-2 _margin-center ">
  <div class=" _section-article _margin-center _margin-top-2 _divider-bottom">

		{#if protocol}
			<h2>{ protocol.title[0][0] }</h2>

			<div class="list-block-container"> 
				<div class="list-block-item-container list-card _card _padding">
					{#if protocol.fields['Cover Image']}
						<img alt="protocol cover img!!!" class="list-block-cover--page" src={ protocol.fields['Cover Image'][0] }>
					{/if}
					<!-- <p data-field="Name">{ protocol.title[0][0] }</p> -->

					<!-- {#if protocol.fields['Author']}
						<p data-field="Author">{ protocol.fields['Author'] }</p>
					{/if} -->
			
					{#if protocol.users && protocol.users[0]}
						<TeamCard class="_margin-top _margin-bottom" profile={protocol.users[0]} inline={true} />
					{/if}


					{#if protocol.fields['Description']}
						<p class="_margin-top-2 _margin-bottom-2" data-field="Description">{ protocol.fields['Description'] }</p>
					{/if}

					{#if protocol.content.markdown}
						{@html marked(protocol.content.markdown.join('') || '')}
					{/if}
				</div>
			</div>

			<div class="Discussion _padding _card _margin-top-2">
				<CommentBox locationId={slug} />
			</div>

		{/if}
	</div>
</div>



<script>

  import marked from 'marked';

  import TeamCard from '../../components/TeamCard.svelte'
	import CommentBox from '../../components/CommentBox.svelte';
	
	export let protocol, slug

	$: console.log('[Protocol]', protocol, slug)


</script>

<style>

</style>


