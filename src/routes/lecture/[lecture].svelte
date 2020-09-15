
<!-- 

	Used for a Lecture Series

 -->

<script context="module">
	export async function preload({ params, query }) {
		const slug = params.lecture, ref = `Slug|${params.lecture}`
    // const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const lecture = await this.fetch(`/api/notion?getLecture=${params.lecture}`).then(r => r.json())

		return { lecture: lecture.lecture, classes: lecture.classes, slug: params.lecture};
	}
</script>


<div class="lecture _section-page _padding-top-2 _margin-center ">
  <div class=" _section-article _margin-center _divider-top _divider-bottom">

		{#if lecture}
			<div class="list-block-container"> 
				<div class="list-block-item-container _card _padding">
					{#if lecture.fields['Cover Image']}
						<img alt="lecture cover img!!!" class="list-block-cover--page" src={ lecture.fields['Cover Image'][0] }>
					{/if}
					<p data-field="Name">{ lecture.title[0][0] }</p>

					{#if lecture.fields['Author']}
						<p data-field="Author">{ lecture.fields['Author'] }</p>
					{/if}

					{#if lecture.fields['Description']}
						<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
						{@html marked(lecture.fields['Description'] || '') }</p>
					{/if}

					{#if lecture.content.markdown}
						<div class="_divider-top _divider-bottom">
							{@html marked(lecture.content.markdown.join('') || '')}
						</div>
					{/if}

					<!-- single-class lecture — just add the class in here -->
					{#if classes.length == 1}
						{#each classes as item} <!-- this is just for ease -->

		    			{#if item.fields['Video'] && item.fields['Video'][0]}
		    				<div class="_divider-top _margin-bottom-2">
		            	<Video video={item.fields['Video'][0]} />
		            </div>
							{/if}

							<div class="_margin-bottom-2">{@html marked(item.content.markdown.join('') || '') }</div>
						{/each}
					{/if}



					<!-- multi-classes -->

					{#if classes.length > 1}
						{#each classes as item}
							<div class="_card _padding _margin-bottom-2">
								<a rel=prefetch class="Lecture-link" href={`/class/${item.fields['Slug']}`}>
									{#if item.fields['Cover Image']}
										<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
									{/if}
									<strong>{@html marked(item.title[0][0]) }</strong>
								</a>
								{#if item.fields['Author']}
									<p data-field="Author">{ item.fields['Author'] }</p>
								{/if}

								{#if item.fields['Description']}
									<p data-field="Description">{ item.fields['Description'] }</p>
								{/if}
							</div>
						{/each}
					{/if}

				</div>
			</div>

		{/if}
	</div>
</div>



<script>

  import marked from 'marked';
  import Video from '../../components/Video.svelte'
	export let lecture, classes

	$: console.log(lecture, classes)


</script>

<style type="text/scss">

	.Lecture-link {
		color: rgba(0, 0, 0, 0.87) !important;
	}

</style>


