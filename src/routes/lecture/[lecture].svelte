
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
				<div class="list-block-item-container list-card __large _card _padding">


					<!-- single-class lecture — just add the class in here -->
					{#if classes.length == 1}
						{#each classes as item} <!-- this is just for ease -->


							<!-- show video on top for single classes to replace the cover image -->
		    			{#if item.fields['Video'] && item.fields['Video'][0]}
		    				<div class=" _margin-bottom-2">
		            	<Video cover={item.fields['Video Cover']} video={item.fields['Video'][0]} filesize={item.fields['Video Size']} captions={item.fields['Video Captions']} />
		            </div>
		          {:else}
								{#if lecture.fields['Cover Image']}
									<img alt="lecture cover img!!!" class="list-block-cover--page" src={ lecture.fields['Cover Image'][0] }>
								{/if}
							{/if}

							<p data-field="Name">{ lecture.title[0][0] }</p>

							{#if lecture.fields['Author']}
								<p data-field="Author">{ lecture.fields['Author'] }</p>
							{/if}

							<!-- hide the card description for single classes since you jump right in -->
							<!-- {#if lecture.fields['Description']}
								<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
								{@html marked(lecture.fields['Description'] || '') }</p>
							{/if} -->
							<!-- {#if lecture.content.markdown}
								<div class="_divider-top _divider-bottom">
									{@html marked(lecture.content.markdown.join('') || '')}
								</div>
							{/if} -->

							<div class="" data-field="Description">
								{@html marked(entities.decode(item.content.markdown.join('')) || '') }
							</div>



						{/each}
					{/if}




















					<!-- multi-classes -->

					{#if classes.length > 1}

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

						<div class="Lecture-classes">
							{#each classes as item}
								<!-- <div class="Lecture-link-card _card _padding _margin-bottom-2"> -->
								<div class="_margin-bottom-2">
									<a rel=prefetch class="Lecture-link" href={`/class/${item.fields['Slug']}`}>
										{#if item.fields['Cover Image']}
											<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
										{/if}
										<strong class="Lecture-classes-title">{@html marked(item.title[0][0]) }</strong>
									</a>
									{#if item.fields['Author']}
										<p data-field="Author">{ item.fields['Author'] }</p>
									{/if}

									{#if item.fields['Description']}
										<div data-field="Description">{@html marked(item.fields['Description']) }</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

				</div>

				{#if classes.length == 1}
					<div class="Discussion _padding _card _margin-top-2">
						<CommentBox locationId={slug} />
					</div>
				{/if}
			</div>

		{/if}
	</div>
</div>



<script>

  import marked from 'marked';
  import Video from '../../components/Video.svelte'
	import CommentBox from '../../components/CommentBox.svelte';
	import entities from 'entities'

	export let lecture, classes, slug

	$: console.log('[lecture]', lecture, classes)


</script>

<style type="text/scss">


</style>


