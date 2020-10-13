
<script context="module">
	export async function preload({ params, query }) {
		const slug = params.protocol, ref = `Slug|${params.protocol}`
    const protocol = await this.fetch(`/api/notion?getField=Slug|${params.protocol}`).then(r => r.json())
		

		return { protocol: undefined || protocol[ref][0], slug: `protocols-${params.protocol}`};
	}
</script>


<div class="Protocol _section-page _padding-top-2 _margin-center ">
  <div class=" _section-article _margin-center _divider-top _divider-bottom">

		{#if protocol}
			<div class="list-block-container"> 
				<div class="list-block-item-container list-card _card _padding">
					{#if protocol.fields['Cover Image']}
						<img alt="protocol cover img!!!" class="list-block-cover--page" src={ protocol.fields['Cover Image'][0] }>
					{/if}
					<p data-field="Name">{ protocol.title[0][0] }</p>

					{#if protocol.fields['Author']}
						<p data-field="Author">{ protocol.fields['Author'] }</p>
					{/if}

					{#if protocol.fields['Description']}
						<p class="_margin-top-2 _margin-bottom-2" data-field="Description">{ protocol.fields['Description'] }</p>
					{/if}

					{#if protocol.content.markdown}
						{@html marked(protocol.content.markdown.join('') || '')}
					{/if}
				</div>
			</div>

			<div class="Discussion _padding _card _divider-top">
				<CommentBox locationId={slug} />
			</div>

		{/if}
	</div>
</div>



<script>

  import marked from 'marked';

	import CommentBox from '../../components/CommentBox.svelte';
	
	export let protocol, slug

	$: console.log(protocol, slug)


</script>

<style>

</style>


