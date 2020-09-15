
{#if lecture}
	<div class="Lecture list-block-container"> 
		<a class="list-block-link" href={lecture.fields['URL']}>
			<div class="list-block-item-container _card _padding">
				{#if lecture.fields['Cover Image']}
					<img alt="lecture cover img" class="list-block-cover" src={ lecture.fields['Cover Image'][0] }>
				{/if}
				<p data-field="Name">{ lecture.title[0][0] }</p>

				{#if lecture.fields['Author']}
					<p data-field="Author">{ lecture.fields['Author'] }</p>
				{/if}

				{#if lecture.fields['Description']}
					<p data-field="Description">{ lecture.fields['Description'] }</p>
				{/if}

				{#if showSeries && lecture['series']}
					<h5>Sections</h5>
					<div class="Lecture-series">
						{#each lecture['series'] as item}
							<p class="Lecture-series-item" data-field="Description">{ item.title[0] }</p>
						{/each}
					</div>
				{/if}

			</div>
		</a>
	</div>

{/if}



<script>

	export let lecture, showSeries

// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	// $: console.log(lecture)


</script>

<style>
</style>