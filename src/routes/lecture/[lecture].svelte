
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

		return { lecture: lecture.lecture, classes: lecture.classes, slug: params.lecture, firstClassObj};
	}
</script>





<div class="Lecture ">

  <Breadcrumbs links={[
    {href:'/', name:'Home'},
    {href:'/lectures', name:'Lectures'},
    {href:`/lecture/${slug}`, name: lecture.title[0][0] || slug},
    ]} 
  />


	<div class="_section-page _padding-top-2 _margin-center ">


	  <div class=" _section-article _margin-center _margin-top-2 _divider-bottom">

			{#if lecture}

				{#if classes.length > 1}
					<h6 class="_padding-bottom-none-i __normal">Lecture Series</h6>
				{/if}

				<h2 class="_padding-bottom-2">{ lecture.title[0][0] }</h2>
				<div class="list-block-container"> 
					<div class="list-block-item-container list-card __main _card _padding">


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
									{@html marked(entities.decode(item.content.markdown.join('')) || '') }
								</div>



							{/each}
						{/if}




















						<!-- multi-classes -->

						{#if classes.length > 1}

							{#if lecture.fields['Cover Image']}
								<img alt="lecture cover img!!!" class="list-block-cover--page" src={ lecture.fields['Cover Image'][0] }>
							{/if}
							<!-- <p data-field="Name">{ lecture.title[0][0] }</p> -->

							<!--{#if lecture.fields['Author']}
								<p data-field="Author">{ lecture.fields['Author'] }</p>
								<div class="_margin-top _margin-bottom-2" >
									<!~~ <TeamCard profile={lecture.classObj['author']} inline={true} /> ~~>
								</div>
							{/if}-->


							{#if lecture.fields['Description']}
								<p class="_margin-top-2 _margin-bottom-2" data-field="Description">
								{@html marked(lecture.fields['Description'] || '') }</p>
							{/if}

							{#if lecture.content.markdown}
								<div class="_divider-top _divider-bottom">
									{@html marked(lecture.content.markdown.join('') || '')}
								</div>
							{/if}

							{#if $User}
								<!-- users can bookmark an entire lecture series -->
								<div class="Class-user _margin-top-2 _margin-bottom-2">
									<UserPanel classObj={lecture}/>
								</div>
							{/if}

							<div class="Lecture-classes">

								<h6 class="__normal">Lecture Series</h6>

								{#each filteredClasses as item}
									<!-- <div class="Lecture-link-card _card _padding _margin-bottom-2"> -->
									<a rel=prefetch class="Lecture-link" href={`/class/${item.fields['Slug']}`}>
										<div class="Lecture-link-card _card _padding _margin-bottom">
											{#if item.fields['Cover Image']}
												<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
											{/if}
											<strong class="Lecture-classes-title">{@html marked(item.title[0][0]) }</strong>
											{#if item.fields['Author']}
												<!-- <p data-field="Author">{ item.fields['Author'] }</p> -->
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

	export let lecture, classes, slug, firstClassObj
	let filteredClasses

	// $: console.log('[lecture]', firstClassObj, lecture, classes)

	$: {
    filteredClasses = filterByStatus(classes)
	}

</script>

<style type="text/scss">


</style>


