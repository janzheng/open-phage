
<script context="module">
	export async function preload({ path, params, query }) {
		const slug = params.lecture
    // const lecture = await this.fetch(`/api/notion?getField=${ref}, ${query.getField}`).then(r => r.json())

    const data = await this.fetch(`/api/notion?getClass=${params.class}`).then(r => r.json())

    // build classes for each??
    let _lectures = data.classes.map(async (_class,i) => {
    	let _cl = await this.fetch(`/api/notion?getClass=${_class.fields['Slug']}`).then(r => r.json())
    	data.classes[i]['classObj'] = _cl
    })
    await Promise.all(_lectures)


		return { 
			data: data, 
			lecture: data.lecture, 
			classObj: data.class, 
			classes: data.classes, 
			author: data.author, 
			slug: params.lecture, path};
	}
</script>


<div class="Class">

	{#if classObj}
	  <Breadcrumbs links={[
	    {href:'/', name:'Home'},
	    {href:'/lectures', name:'Lectures'},
	    {href:`/lecture/${lecture.fields['Slug']}`, name: lecture.title[0][0]},
	    {href:`/class/${classObj.fields['Slug']}`, name: classObj.title[0][0] || slug},
	    ]} 
	    ]} 
	  />
  {/if}

	<div class="_section-page _margin-center _margin-bottom-2">
		<div class="Class-return-home">
			<a rel=prefetch href={`/lecture/${lecture.fields['Slug']}`} class="_button __cta _margin-top-2 _margin-bottom-none-i">
				⟵ Return to Series
			</a>
		</div>
	</div>


	<div class="_section-page _margin-center _margin-top-2 _divider-bottom">

		<h2>{ classObj.title[0][0] }</h2>

		<div class={` _padding-top-2  ${filteredClasses.length > 1 ? '_grid-3-1 _grid-gap-large' : ''}`}>
			
		  <div class="Class-body">


				{#if classObj}
					<div class="list-block-container"> 
						<div class="list-block-item-container list-card _card _padding">
							{#if classObj.fields['Video'] && classObj.fields['Video'][0]}
			    				<div class=" _margin-bottom-2">
			            	<Video classes="Class-video" cover={classObj.fields['Video Cover']} video={classObj.fields['Video'][0]} filesize={classObj.fields['Video Size']} captions={classObj.fields['Video Captions']} />
			            </div>
			          {:else}
									{#if classObj.fields['Cover Image']}
										<img alt="lecture cover img!!!" class="list-block-cover--page" src={ classObj.fields['Cover Image'][0] }>
									{/if}
								{/if}




							<!-- <p data-field="Name">{ classObj.title[0][0] }</p> -->

							{#if author}
								<!-- <p data-field="Author">{ classObj.fields['Author'] }</p> -->
								<TeamCard class="_margin-top _margin-bottom" profile={author} inline={true} />
							{/if}

							{#if $User}
								<div class="Class-user _margin-top-2 _margin-bottom-2">
									<UserPanel {classObj}/>
								</div>
							{/if}

							<!-- only use descriptions on lectures index -->
							<!-- {#if classObj.fields['Description']}
								<div class="_margin-top-2" data-field="Description">
									{@html marked(classObj.fields['Description'] || '') }
								</div>
							{/if}
							-->
							{#if classObj.content.markdown && classObj.content.markdown.join('').length > 0}
								<div class="_margin-top-2">
									{@html marked(classObj.content.markdown.join('') || '')}
								</div>
							{/if}

						</div>

						<!-- next class -->
						{#if nextClass}
							<div class="NextClass-container _margin-top">
								<!-- <a rel=prefetch class="NextClass-link __underline-none " href={`/class/${nextClass.fields['Slug']}`}> -->
								<a rel=prefetch class="_button __width-full __cta _margin-bottom-none-i __underline-none " href={`/class/${nextClass.fields['Slug']}`}>
									<!-- <div class="NextClass-card Lecture-link-card _padding _card"> -->
										<div class="_margin-bottom-half">Next class</div>
										<p class="_margin-bottom-none-i" data-field="Name">{ nextClass.title[0][0] }</p>

										<!-- {#if nextClass.fields['Description']}
											<div class="_margin-top " data-field="Description">
												{@html marked(nextClass.fields['Description'] || '') }
											</div>
										{/if} -->
									<!-- </div> -->
								</a>
							</div>
						{/if}

						<div class="Class-return-home _divider-bottom _margin-top">
							<a rel=prefetch href={`/lecture/${lecture.fields['Slug']}`} class="_button __cta _margin-bottom-none-i">
								⟵ Return to lecture series
							</a>
						</div>

						<div class="Discussion _padding _card _margin-top-2">
							<CommentBox locationId={slug} />
						</div>

					</div>

				{/if}
			</div>





			<!-- sidebar -->
			{#if filteredClasses.length > 1}
				<div class="Class-sidebar">
					<div class="_margin-bottom">
						<a class="__underline-none" rel=prefetch href={`/lecture/${lecture.fields['Slug']}`}><h6 class="_padding-top-none-i">{ lecture.title[0][0] }</h6></a>
					</div>

					<div class="Lecture-classes">
						{#each filteredClasses as item}
							<a rel=prefetch class={`Lecture-link __copy Class-toc--link ${ path==='/class/'+item.fields['Slug']? '__active':''}`} href={`/class/${item.fields['Slug']}`}>
								<div class="Lecture-link-card _card _card _padding _margin-bottom">
									<!-- {#if item.fields['Cover Image']}
										<img alt="lecture cover img" class="Lecture-cover" src={ item.fields['Cover Image'][0] }>
									{/if} -->
									<span class="Lecture-classes-title">{@html marked(item.title[0][0]) }</span>

									<div class="_margin-top" >
										{#if item.classObj['author']}
											<TeamCard profile={item.classObj['author']} simple={true} />
										{/if}
									</div>
								<!-- {#if item.fields['Author']}
									<p data-field="Author">{ item.fields['Author'] }</p>
								{/if} -->

								<!-- 
								{#if item.fields['Description']}
									<p data-field="Description">{ item.fields['Description'] }</p>
								{/if}
								-->
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}

		</div>
	</div>
</div>






<script>

  import marked from 'marked';
	import { User } from '../../stores/stores.js';

  import Video from '../../components/Video.svelte'
  import TeamCard from '../../components/TeamCard.svelte'
	import CommentBox from '../../components/CommentBox.svelte'
  import Breadcrumbs from '../../components/Breadcrumbs.svelte'
  import UserPanel from '../../components/UserPanel.svelte'

	export let lecture, classes, classObj, data, path, author, slug
	let filteredClasses
	
	import { filterByStatus } from '@/_utils/app-helpers'


	// $: console.log('[class]', classObj)
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

	$: {
		filteredClasses = filterByStatus(classes)
	}



</script>

<style type="text/scss">

	// .Class-toc--link {
	// 	color: rgba(0, 0, 0, 0.87) !important;
	// }
	
	:global(.Class-video) {
		// :global(video) {
			width: 100%
		// }
	}



</style>


