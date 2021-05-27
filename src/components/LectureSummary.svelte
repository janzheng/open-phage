
{#if lecture}
	<div class={`LectureCard list-block-container ${isHero ? '__hero' : ''}`}> 
		<!-- <a rel=prefetch class="list-block-link" href={lecture.fields['URL']}> -->
			<div class={`list-block-item-container list-card ${classes} ${lecture.fields['Cover Image'] ? '_grid-1-3 _grid-gap-large' : ''}`}>

				{#if !hideSummary}
					{#if lecture.fields['Cover Image']}
						<div>
							<img class="LectureCard-cover" alt="lecture cover img" src={ lecture.fields['Cover Image'][0] }>
						</div>
					{/if}
				{/if}

				<div>

					{#if !hideSummary}
						<!-- <a class="__underline-none" rel=preload href={lecture.fields['URL']}> -->
							<h2 data-field="Name">{ lecture.title[0][0] }</h2>
						<!-- </a> -->

						{#if lecture.fields['Author']}
							<p data-field="Author">{ lecture.fields['Author'] }</p>
						{/if}

						{#if lecture.fields['Description']}
							<div data-field="Description">{@html marked(lecture.fields['Description'] || '') }</div>
						{/if}
					{/if}


					<div class="LectureCard-series-container _margin-top-2">
						<div class="LectureCard-series">
							{#each filteredSeries as item}
								<!-- <UserSliver classes={'_float-left _margin-right-half'} showText={false} url={item.fields['URL']} /> -->
								<!-- <p class="LectureCard-series-item" data-field="Description">{ item.title[0] }</p> -->
								<LectureInline lecture={item} {authors} />
							{/each}
						</div>
					</div>
				</div>

			</div>

		<!-- </a> -->
	</div>

{/if}



<script>

  import marked from 'marked';
	import UserSliver from './UserSliver.svelte'
	import LectureInline from './LectureInline.svelte'
  import { filterByStatus } from '@/_project/app-helpers'

	export let lecture, isHero, authors, series, hideSummary
	export let classes = '_card _padding _padding-top-2-i _padding-bottom-2-i'
	let filteredSeries

	// these exist for series with only one class
	// let lectureClass 
	// $: if(lecture && lecture.series && lecture.series.length == 1)
	// 	lectureClass = lecture.series[0]

	$: {
		filteredSeries = series || filterByStatus(lecture['series'])
	}

	// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}
	// $: console.log('[Lecture Summary]', filteredSeries)

</script>
