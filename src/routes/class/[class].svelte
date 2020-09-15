
<script context="module">
	export async function preload({ params, query }) {
		const slug = params.lecture, ref = `Slug|${params.lecture}`
    // const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const data = await this.fetch(`/api/notion?getClass=${params.class}`).then(r => r.json())

		return { lecture: data.lecture, classObj: data.class, classes: data.classes, slug: params.lecture};
	}
</script>


<div class="Class _section-page _margin-center _divider-top _divider-bottom">
	<div class={` _padding-top-2  ${classes.length > 1 ? '_grid-3-1 _grid-gap-large' : ''}`}>
		
	  <div class="Class-body">

			{#if classObj}
				<div class="list-block-container"> 
					<div class="list-block-item-container _card _padding">
						{#if classObj.fields['Cover Image']}
							<img alt="lecture cover img!!!" class="list-block-cover--page" src={ classObj.fields['Cover Image'][0] }>
						{/if}
						<p data-field="Name">{ classObj.title[0][0] }</p>

						{#if classObj.fields['Author']}
							<p data-field="Author">{ classObj.fields['Author'] }</p>
						{/if}

						{#if classObj.fields['Description']}
							<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
							{@html marked(classObj.fields['Description'] || '') }</p>
						{/if}

						{#if classObj.content.markdown}
							<div class="_divider-top _divider-bottom">
								{@html marked(classObj.content.markdown.join('') || '')}
							</div>
						{/if}

					</div>
				</div>

			{/if}
		</div>






		{#if classes.length > 1}
			<div class="Class-sidebar">
				<div class="_margin-bottom-2">
					<strong>{ lecture.title[0][0] }</strong>
				</div>
				{#each classes as item}
					<div class=" ">
						<a rel=prefetch class="Class-toc--link" href={`/class/${item.fields['Slug']}`}>
							{#if item.fields['Cover Image']}
								<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
							{/if}
							{@html marked(item.title[0][0]) }
						</a>
						{#if item.fields['Author']}
							<p data-field="Author">{ item.fields['Author'] }</p>
						{/if}

						<!-- {#if item.fields['Description']}
							<p data-field="Description">{ item.fields['Description'] }</p>
						{/if} -->
					</div>
				{/each}
			</div>
		{/if}

	</div>
</div>



<script>

  import marked from 'marked';
  import Video from '../../components/Video.svelte'
	export let lecture, classes, classObj

	$: console.log(lecture, classObj, classes)


</script>

<style type="text/scss">

	.Class-toc--link {
		color: rgba(0, 0, 0, 0.87) !important;
	}

</style>


