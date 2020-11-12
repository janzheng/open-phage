
{#if lecture}
	<div class={`LectureCard list-block-container ${isHero ? '__hero' : ''}`}> 
		<a rel=prefetch class="list-block-link" href={lecture.fields['URL']}>
			<div class={`list-block-item-container list-card _card _padding _padding-top-2-i _padding-bottom-2-i ${lecture.fields['Cover Image'] ? '_grid-1-3 _grid-gap-large' : ''}`}>

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


					<!-- for lectures w/ a single class -->
					{#if lectureClass}
						<div class="_margin-top"> 
							<UserSliver url={lectureClass.fields['URL']} />
						</div>
					<!-- for lecture series -->
					{:else}
						<div class="_margin-top"> 
							<UserSliver url={lecture.fields['URL']} />
						</div>
					{/if}

					{#if showSeries && filteredSeries && filteredSeries.length > 0}
						<div class="LectureCard-series-container _card _padding _margin-top-2">
							<h6 class="">Contents</h6>
							<div class="LectureCard-series">
								{#each filteredSeries as item}
									<UserSliver classes={'_float-left _margin-right-half'} showText={false} url={item.fields['URL']} />
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
  import UserSliver from './UserSliver.svelte'
  import { filterByStatus } from '@/_utils/app-helpers'

	export let lecture, showSeries, isHero
	let filteredSeries

	// these exist for series with only one class
	let lectureClass 
	$: if(lecture && lecture.series && lecture.series.length == 1)
		lectureClass = lecture.series[0]

	$: {
		filteredSeries = filterByStatus(lecture['series'])
	}

// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	// $: console.log('[Lecture Card]', lecture.fields['Name'], lecture)


</script>
