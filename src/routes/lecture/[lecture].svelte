
<script context="module">
	export async function preload({ params, query }) {
		console.log('!!!!!!!!!!!!!!!!query:', query.getField)
		const slug = params.lecture, ref = `Slug|${params.lecture}`
    const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const lectureObj = lecture[ref] ? lecture[ref][0] : undefined

		return { lecture: lectureObj, classes: lecture[query.getField], slug: params.lecture};
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
						<p class="_margin-top-2 _margin-bottom-2" data-field="Description">{ lecture.fields['Description'] }</p>
					{/if}

					{#if lecture.content.markdown}
						{@html marked(lecture.content.markdown.join('') || '')}
					{/if}

					{#if classes}
						{#each classes as item}
						<p>{ item.title[0][0] }</p>
						{/each}
					{/if}


				</div>
			</div>

		{/if}
	</div>
</div>



<script>

  import marked from 'marked';
	export let lecture, classes

	$: console.log(lecture, classes)


</script>

<style>

</style>