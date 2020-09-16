
{#if lecture}
	<div class="Lecture list-block-container"> 
		<div class="list-block-item-container _card _padding">

			<a rel=prefetch class="list-block-link" href={lecture.fields['URL']}>
				{#if lecture.fields['Cover Image']}
					<img alt="lecture cover img" class="Lecture-cover" src={ lecture.fields['Cover Image'][0] }>
				{/if}
				<p data-field="Name">{ lecture.title[0][0] }</p>

				{#if lecture.fields['Author']}
					<p data-field="Author">{ lecture.fields['Author'] }</p>
				{/if}
			</a>

			{#if lecture.fields['Description']}
				<div data-field="Description">{@html marked(lecture.fields['Description'] || '') }</div>
			{/if}

			{#if showSeries && lecture['series'] && lecture['series'].length > 1}
				<div class="Lecture-series-container _card _padding _margin-top-2">
					<!-- <div class="_padding-bottom"><strong>Class Sections</strong></div> -->
					<div class="Lecture-series">
						{#each lecture['series'] as item}
							<p class="Lecture-series-item" data-field="Description">{ item.title[0] }</p>
						{/each}
					</div>
				</div>
			{/if}

		</div>
	</div>

{/if}



<script>

  import marked from 'marked';
	export let lecture, showSeries

// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	// $: console.log(lecture)


</script>

<style type="text/scss">

	.Lecture-series-container {
		&, * {
			font-size: 0.9rem;
			line-height: 1.3rem;
		}
	}

	.Lecture-cover {
		width: 100%;
		max-height: 320px;
		object-fit: cover;
		border-radius: 4px;
	}
</style>


