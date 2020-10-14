
<script context="module">
	export async function preload({ path, params, query }) {
		const slug = params.lecture
    // const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const data = await this.fetch(`/api/notion?getClass=${params.class}`).then(r => r.json())

		return { 
			data: data, 
			lecture: data.lecture, 
			classObj: data.class, 
			classes: data.classes, 
			author: data.author, 
			slug: params.lecture, path};
	}
</script>


<div class="Class _section-page _margin-center _divider-top _divider-bottom">
	<div class={` _padding-top-2  ${classes.length > 1 ? '_grid-3-1 _grid-gap-large' : ''}`}>
		
	  <div class="Class-body">

			{#if classObj}
				<div class="list-block-container"> 
					<div class="list-block-item-container list-card _card _padding">
						{#if classObj.fields['Cover Image']}
							<img alt="lecture cover img!!!" class="list-block-cover--page" src={ classObj.fields['Cover Image'][0] }>
						{/if}
						<p data-field="Name">{ classObj.title[0][0] }</p>

						{#if author}
							<!-- <p data-field="Author">{ classObj.fields['Author'] }</p> -->
							<TeamCard profile={author} />
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

					<!-- next class -->
					{#if nextClass}
						<a rel=prefetch class="Lecture-link" href={`/class/${nextClass.fields['Slug']}`}>
							<div class="_divider-top _divider-bottom _padding _card">
								Next class: 
								<p data-field="Name">{ nextClass.title[0][0] }</p>

								{#if nextClass.fields['Description']}
									<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
									{@html marked(nextClass.fields['Description'] || '') }</p>
								{/if}
							</div>
						</a>
					{/if}

					<div class="Discussion _padding _card _margin-top-2">
						<CommentBox locationId={slug} />
					</div>

				</div>

			{/if}
		</div>





		<!-- sidebar -->
		{#if classes.length > 1}
			<div class="Class-sidebar">
				<div class="_margin-bottom-2">
					<strong>{ lecture.title[0][0] }</strong>
				</div>
				{#each classes as item}
					<div class=" ">
						<a rel=prefetch class={`Class-toc--link ${ path==='/class/'+item.fields['Slug']? '_active':''}`} href={`/class/${item.fields['Slug']}`}>
							{#if item.fields['Cover Image']}
								<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
							{/if}
							{@html marked(item.title[0][0]) }
						</a>
						{#if item.fields['Author']}
							<p data-field="Author">{ item.fields['Author'] }</p>
						{/if}

						<!-- 
						{#if item.fields['Description']}
							<p data-field="Description">{ item.fields['Description'] }</p>
						{/if}
						-->
					</div>
				{/each}
			</div>
		{/if}

	</div>
</div>



<script>

  import marked from 'marked';
  import Video from '../../components/Video.svelte'
  import TeamCard from '../../components/TeamCard.svelte'
	import CommentBox from '../../components/CommentBox.svelte';

	export let lecture, classes, classObj, data, path, author, slug

	// $: console.log(path)
	// $: console.log(data)

	function getNextClass() {
		const classId = classObj.id
		let nextClass
		classes.map((c, i) => {
			if(classId == c.id) {
				if(classes[i+1])
					nextClass=classes[i+1]
			}
			// console.log('?!', c.id)
		})
		// console.log('?!!!', nextClass)
		return nextClass
	}

	let nextClass
	$: if(data)
		nextClass = getNextClass()


</script>

<style type="text/scss">

	.Class-toc--link {
		color: rgba(0, 0, 0, 0.87) !important;
	}

	._active {
		font-weight: bold;
	}

</style>


