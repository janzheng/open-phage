
<!-- 

	Used for a Lecture Series

 -->

<script context="module">
	export async function preload({ params, query }) {
		const slug = params.lecture, ref = `Slug|${params.lecture}`
    // const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const lecture = await this.fetch(`/api/notion?getLecture=${params.lecture}`).then(r => r.json())

    // get the class if it's only one / convenience
    let firstClassObj

    // this renders the class here rather than on a /class/ route 
    if (lecture.classes.length == 1) {
    	firstClassObj = await this.fetch(`/api/notion?getClass=${lecture.classes[0].fields['Slug']}`).then(r => r.json())
    }

    // build classes for each??
    let _lectures = lecture.classes.map(async (_class,i) => {
    	let _cl = await this.fetch(`/api/notion?getClass=${_class.fields['Slug']}`).then(r => r.json())
    	lecture.classes[i]['classObj'] = _cl
    })
		await Promise.all(_lectures)

		return { authors: lecture.authors, lecture: lecture.lecture, classes: lecture.classes, slug: params.lecture, firstClassObj};
	}
</script>





<svelte:head>
  <title>{lecture.title[0][0]}</title>
</svelte:head>

<div class="Lecture ">

  <Breadcrumbs links={[
    {href:'/', name:'Home'},
    {href:'/lectures', name:'Contents'},
    {href:`/lecture/${slug}`, name: lecture.title[0][0] || slug},
    ]} 
  />


	<div class="_section-page _padding-top-2 _margin-center ">


	  <!-- <div class=" _section-article _margin-center _margin-top-2 _divider-bottom"> -->
	  <div class=" _margin-center _margin-top-2 _divider-bottom">

			{#if lecture}

				{#if classes.length > 1}
					<!-- <h6 class="_padding-bottom-none-i __normal">Contents</h6> -->
				{/if}

				<h2 class="_padding-bottom-2">{ lecture.title[0][0] }</h2>
				<div class="list-block-container"> 
					<div class="list-block-item-container list-card __main">


						<!-- single-class lecture — just add the class in here -->
						{#if classes.length == 1}
							{#each classes as item} <!-- this is just for ease -->


								<!-- show video on top for single classes to replace the cover image -->
			    			{#if item.fields['Video'] && item.fields['Video'][0]}
			    				<div class=" _margin-bottom-2">
			            	<Video cover={item.fields['Video Cover']} video={item.fields['Video'][0]} filesize={item.fields['Video Size']} captions={item.fields['Video Captions']} slug={item.fields['Slug']} />
			            </div>
			          {:else}
									{#if lecture.fields['Cover Image']}
										<img alt="lecture cover img!!!" class="list-block-cover--page" src={ lecture.fields['Cover Image'][0] }>
									{/if}
								{/if}

								<!-- <p data-field="Name">{ lecture.title[0][0] }</p> -->


								{#if firstClassObj['author']}
									<!-- <p data-field="Author">{ classObj.fields['Author'] }</p> -->
									<div class="_margin-top _margin-bottom-2" >
										<TeamCard profile={firstClassObj['author']} inline={true} />
									</div>
								{/if}

								{#if $User}
									<div class="Class-user _margin-top-2 _margin-bottom-2">
										<UserPanel classObj={item}/>
									</div>
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
									{@html marked(entities.decode(lineClean(item.content.markdown)) || '') }
								</div>



							{/each}
						{/if}




















						<!-- multi-classes -->

						{#if classes.length > 1}

							{#if lecture.fields['Cover Image']}
								<img alt="lecture cover img!!!" class="list-block-cover--page" src={ lecture.fields['Cover Image'][0] }>
							{/if}

							{#if lecture.fields['Description']}
								<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
								{@html marked(lecture.fields['Description'] || '') }</p>
							{/if}

							{#if lecture.content.markdown && lecture.content.markdown.join('')}
								<div class="_divider-top _divider-bottom">
									{@html marked(lecture.content.markdown.join('') || '')}
								</div>
							{/if}

							{#if $User}
								<div class="Class-user _margin-top-2 _margin-bottom-2">
									<UserPanel classObj={lecture}/>
								</div>
							{/if}

							<div class="Lecture-classes">
								<LectureSummary lecture={lecture} series={filteredClasses} authors={authors} classes='' hideSummary={true} />
								<!-- {#each filteredClasses as item}
									<a rel=prefetch class="Lecture-link" href={`/class/${item.fields['Slug']}`}>
										<div class="Lecture-link-card _card _padding _margin-bottom">
											{#if item.fields['Cover Image']}
												<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
											{/if}
											<strong class="Lecture-classes-title">{@html marked(item.title[0][0]) }</strong>
											{#if item.fields['Author']}
												<div class="_margin-top _margin-bottom" >
													<TeamCard profile={item.classObj['author']} simple={true} />
												</div>
											{/if}

											{#if item.fields['Description']}
												<div data-field="Description">{@html marked(item.fields['Description']) }</div>
											{/if}
											{#if item.fields['URL'] && $User}
												<UserSliver classes="_margin-top _margin-bottom" url={item.fields['URL']} />
											{/if}
										</div>
									</a>
								{/each} -->
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
</div>



<script>

  import marked from 'marked'
	import entities from 'entities'

  import { filterByStatus } from '@/_utils/app-helpers'

	import { User } from '../../stores/stores.js';
  import UserSliver from '../../components/UserSliver.svelte'
  import UserPanel from '../../components/UserPanel.svelte'
  import Video from '../../components/Video.svelte'
	import CommentBox from '../../components/CommentBox.svelte'
  import Breadcrumbs from '../../components/Breadcrumbs.svelte'
  import TeamCard from '../../components/TeamCard.svelte'

	import LectureSummary from '../../components/LectureSummary.svelte'
	
	export let lecture, classes, slug, firstClassObj, authors
	let filteredClasses

	// $: console.log('[lecture]', firstClassObj, lecture, classes)

	$: {
		// console.log('lecture:', lecture, classes, authors)
    filteredClasses = filterByStatus(classes)
	}

	const lineClean = (mdArr) => {
		if(mdArr && mdArr.length > 0) {
			let mdLines=''
			mdArr.map(line => {
				mdLines += line.trim() + '\n\n'
			})

			// console.log('md lines:', mdLines)
			return mdLines
		}
	}

</script>

<style type="text/scss">

	:global(details) {
		margin-bottom: 1rem;
	}
	:global(summary) {
		cursor: pointer;
	}

</style>


