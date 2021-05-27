
<script context="module">
	export async function preload({ path, params, query }) {
		const slug = params.class
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
			authors: data.authors,
			slug: slug, 
			path
		};
	}
</script>



<svelte:head>
	<title>{classObj.title[0][0]}</title>
</svelte:head>

{#key slug}


	<div class="Class">

		{#if classObj}
			<Breadcrumbs links={[
				{href:'/', name:'Home'},
				// {href:'/lectures', name:'Contents'},
				// {href:`/lecture/${lecture.fields['Slug']}`, name: lecture.title[0][0]},
				{href:`/class/${classObj.fields['Slug']}`, name: classObj.title[0][0] || slug},
				]} 
			/>
		{/if}

		<!-- <div class="_section-page _margin-center _margin-bottom-2">
			<div class="Class-return-home">
				<a rel=prefetch href={`/lecture/${lecture.fields['Slug']}`} class="_button __cta _margin-top-2 _margin-bottom-none-i">
					← Return to Series
				</a>
			</div>
		</div> -->

		<div class="_section-page _margin-center _margin-top-2 _divider-bottom">

			{#if lecture}
				<a href="{lecture.fields['URL']}" rel=preload class="__nolink" >
					<h6 class="_padding-top-2 _padding-bottom ">{lecture.fields['Name']}</h6>
				</a>
			{/if}
			
			<h2 class="_padding-top-half">{ classObj.title[0][0] }</h2>

			<!-- <div class={` _padding-top-2  ${filteredClasses.length > 1 ? '_grid-3-1 _grid-gap-large' : ''}`}> -->
			<div class={` _padding-top-2  `}>
				
				<div class="Class-body">

					{#if classObj}
						<div class="list-block-container _flex-col"> 
							<div class="list-block-container--body "> 

								<div class="list-block-item-container list-card _card _padding">

									{#if classObj && (classObj.fields['Video'] || classObj.fields['Cover Image'])}
										<div class="Class-video">
											{#if classObj.fields['Video'] && classObj.fields['Video'][0]}
												<div class="">
													<Video classes="Class-video" cover={classObj.fields['Video Cover']} video={classObj.fields['Video'][0]} filesize={classObj.fields['Video Size']} captions={classObj.fields['Video Captions']} slug={classObj.fields['Slug']} />
												</div>
											{:else}
												{#if classObj.fields['Cover Image']}
													<img alt="lecture cover img" class="list-block-cover--page" src={ classObj.fields['Cover Image'][0] }>
												{/if}
											{/if}
										</div>
									{/if}

									{#if author}
										<TeamCard classes="_margin-top _margin-bottom" profile={author} inline={true} />
									{/if}

									{#if $User}
										<div class="Class-user ">
											<UserPanel {classObj} classes="_margin-top-2" />
										</div>
									{/if}
									

									{#if classObj.content.markdown && classObj.content.markdown.join('').length > 0}
										<div class="_margin-top-2">
											{@html marked(mdLines)}
										</div>
									{/if}

								</div>



								<!-- next class -->
								{#if nextClass}
									<div class="NextClass-container _margin-top">
										<!-- <a rel=prefetch class="NextClass-link __underline-none " href={`/class/${nextClass.fields['Slug']}`}> -->
										<a rel=prefetch class="_button __width-full __cta _margin-bottom-none-i __underline-none _padding-left-i _padding-bottom-half-i" href={`/class/${nextClass.fields['Slug']}`}>
											<!-- <div class="NextClass-card Lecture-link-card _padding _card"> -->
												<div class="_margin-bottom-half">Next lecture</div>
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

								{#if classObj.fields['AdminTags'] && classObj.fields['AdminTags'].includes('Comments')}
									<CommentBox classes="Discussion _padding _card _margin-top-2 _flex-1" locationId={slug} />
								{/if}

								<!-- <div class="Class-return-home _margin-bottom-2 _margin-top">
									<a rel=prefetch href={`/lecture/${lecture.fields['Slug']}`} class="_button __cta _margin-bottom-none-i">
										← Return to lecture series
									</a>
								</div> -->
							</div>

							<div class="Lecture-classes _divider-top">
								<LectureSummary lecture={lecture} series={filteredClasses} authors={authors} />
							</div>

						</div>

					{/if}
				</div>


				<!-- sidebar -->
				<!-- {#if filteredClasses.length > 1}
					<div class="Class-sidebar">
						<div class="_margin-bottom">
							<a class="__underline-none" rel=prefetch href={`/lecture/${lecture.fields['Slug']}`}><h6 class="_padding-top-none-i">{ lecture.title[0][0] }</h6></a>
						</div>

						<div class="Lecture-classes">
							{#each filteredClasses as item}
								<a rel=prefetch class={`Lecture-link __copy Class-toc--link ${ path==='/class/'+item.fields['Slug']? '__active':''}`} href={`/class/${item.fields['Slug']}`}>
									<div class="Lecture-link-card _card _card _padding _margin-bottom">
										<span class="Lecture-classes-title">{@html marked(item.title[0][0]) }</span>

										<div class="_margin-top" >
											{#if item.classObj['author']}
												<TeamCard profile={item.classObj['author']} simple={true} />
											{/if}
										</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/if}

				 -->

			</div>
		</div>
	</div>
{/key}





<script>

  import marked from 'marked';
	import { User } from '../../stores/stores.js';

  import Video from '../../components/Video.svelte'
  import TeamCard from '../../components/TeamCard.svelte'
	import CommentBox from '../../components/CommentBox.svelte'
  import Breadcrumbs from '../../components/Breadcrumbs.svelte'
  import UserPanel from '../../components/UserPanel.svelte'
	import LectureSummary from '../../components/LectureSummary.svelte'


	export let lecture, classes, classObj, data, path, author, slug, authors
	let filteredClasses, mdLines=''
	
	import { filterByStatus } from '@/_project/app-helpers'

	marked.setOptions({
		gfm: false,
		breaks: false
	})


	$: if(filteredClasses) {
		console.log('--->>>>', data)
	}



	function getNextClass() { 
		const classId = classObj.id
		let nextClass
		if(filteredClasses && filteredClasses.length>0) {
			filteredClasses.map((c, i) => {
				if(classId == c.id) {
					if(filteredClasses[i+1])
						nextClass=filteredClasses[i+1]
				}
				// console.log('?!', c.id)
			})

		}
		return nextClass
	}

	let nextClass
	$: if(data)
		nextClass = getNextClass()

	$: {
		filteredClasses = filterByStatus(classes)
	}

	$: {
		mdLines=''
		classObj.content.markdown.map(line => {
			mdLines += line.trim() + '\n\n'
		})

		// console.log('md lines:', mdLines)
	}



</script>

<style type="text/scss">

	// .Class-toc--link {
	// 	color: rgba(0, 0, 0, 0.87) !important;
	// }
	
	:global(details) {
		margin-bottom: 1rem;
	}
	:global(summary) {
		cursor: pointer;
	}
	

	:global(.Class-video) {
		// :global(video) {
			width: 100%
		// }
	}

	.list-block-container {
		height: 100%
	}


</style>


