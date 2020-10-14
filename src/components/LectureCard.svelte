
{#if lecture}
	<div class={`LectureCard list-block-container ${isHero ? '__hero' : ''}`}> 
		<a rel=prefetch class="list-block-link" href={lecture.fields['URL']}>
			<div class={`list-block-item-container list-card _card _padding ${lecture.fields['Cover Image'] ? '_grid-1-3 _grid-gap-large' : ''}`}>

				<div>
					{#if lecture.fields['Cover Image']}
						<img class="LectureCard-cover" alt="lecture cover img" src={ lecture.fields['Cover Image'][0] }>
					{/if}
				</div>

				<div>
					<p data-field="Name">{ lecture.title[0][0] }</p>

					{#if lecture.fields['Author']}
						<p data-field="Author">{ lecture.fields['Author'] }</p>
					{/if}

					{#if lecture.fields['Description']}
						<div data-field="Description">{@html marked(lecture.fields['Description'] || '') }</div>
					{/if}

					{#if showSeries && lecture['series'] && lecture['series'].length > 1}
						<div class="LectureCard-series-container _card _padding _margin-top-2">
							<h6 class="">Lecture Chapters</h6>
							<div class="LectureCard-series">
								{#each lecture['series'] as item}
									<p class="LectureCard-series-item" data-field="Description">{ item.title[0] }</p>
								{/each}
							</div>
						</div>
					{/if}
				</div>

			</div>

		</a>
	</div>

{/if}



<script>

  import marked from 'marked';
	export let lecture, showSeries, isHero

// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	// $: console.log('Lecture Card:', lecture.fields['Name'], lecture)


</script>
