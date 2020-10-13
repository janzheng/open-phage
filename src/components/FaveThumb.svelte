

{#if fave && fave.fields }
	<div class="FaveThumb _card _padding" >

		<!-- <div>{fave['baseId']}-{fave['id']} | {faveId} </div> -->

		{#if fave.fields['Images'] && fave.fields['Images'][0] && fave.fields['Images'][0]['thumbnails']}
			<div class="FaveThumb-cover _relative">
				<img class="FaveThumb-cover-img" src={fave.fields['Images'][0]['thumbnails']['small']['url']} />
			</div>
		{/if}

		<a rel=prefetch target="_blank" href={ fave.fields['URL'] } >
			<div class={`FaveThumb-name ${fave.fields['URL'] ? '__wordbreak': ''}`}>{ fave.fields['Name'] || fave.fields['URL']  }</div>
		</a>

		<div class="FaveThumb-menu _margin-top-half">
			{created} — { domain }
		</div>

		{#if showDescription && fave.fields['Description'] }
			<a class="FaveThumb-description-link" rel=prefetch href={href}>
				<div class="FaveThumb-description">{ fave.fields['Description'] }</div>
			</a>
		{/if}

		<div class={`FaveThumb-profile _margin-top ${$profile && $profile.data ? '_grid-2-1-xs _align-vertically' : ''} `}>

			<div class="">
				<!-- <button on:click={handleDelete} class="_button __action __text _padding-none-i _margin-bottom-none" >Delete</button> -->
				<!-- ❤️ -->
				

				<!-- <div class=" __truncate-short"> -->
				<div>
					<!-- <div>showBookmarked? {showBookmarked} | loading: {isLoading}</div> -->
					{#if showBookmarked || (!isLoading && isFavorite(fave))} 
						<button class="__text _padding-none-i _margin-none-i" on:click={async()=>{
							showBookmarked = false
							isLoading = true
							await handleRemoveFavorite(fave)
							showBookmarked = false
							isLoading = false
						}}>❤️</button>&nbsp; 
					{:else}
						<button class="__text _padding-none-i _margin-none-i" on:click={async()=>{
							showBookmarked = true
							isLoading = true
							await handleAddFavorite(fave)
							showBookmarked = false
							isLoading = false
						}}>🤍</button>&nbsp;
					{/if} 
					<!-- <a class="_font-small" rel=prefetch href={href}>🤔</a>  -->
					<a class="_font-small" rel=prefetch href={href}>{commentCount > 0 ? `Comments (${commentCount})` : 'Details'}</a> 
				</div>
			</div>

			{#if profile && $profile && $profile.data}
				<div class={`FaveThumb-profile ${$profile && $profile.data ? '_right-xs _right' : ''} `}>
					<a rel=prefetch href={`/user/${$profile.data.fields['userName']}`}>
						{#if $profile.data.fields['ProfileImage'] && $profile.data.fields['ProfileImage'].length > 0 }
							<img class="FaveThumb-profile-img" alt={`profile for ${$profile.data.fields['userName']}`} src={ $profile.data.fields['ProfileImage'][0]['thumbnails']['small']['url'] }>
						{:else}
							<span class="FaveThumb-profile-username">{ $profile.data.fields['userName'] }</span>
						{/if}
						<!-- <fspan class="FaveThumb-profile-username">{ $profile.data.fields['userName'] }</span> -->
					</a>
				</div>
			{/if}

		</div>

		
	</div>
{/if}


<script>

  import { getContext, onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import marked from 'marked'

  import { getProfile } from '../_utils/auth/get-profile';
  import { timeDifferenceForDate } from '../_utils/_helpers';
  import { isFavorite, handleAddFavorite, handleRemoveFavorite } from '../_utils/app-helpers';

	export let fave, baseId, showDescription=false, collection=false, profile, commentCount
	let showBookmarked=false, isLoading = false
	let domain = '', href = '', favorites, created, faveId

  const User = getContext('User')



  // onMount(async () => { // this doesn't update details on change, e.g. for search terms
	$: if(fave) { // this changes too much
		if(fave) {
			domain = fave.fields['URL'].match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/)
			domain = domain[0]
			domain = domain.replace('https://','')
			domain = domain.replace('http://','')

			created = timeDifferenceForDate(fave.fields['_created'] || fave.fields['Created'])

	  	// console.log(' ------* fave', fave)
  		faveId = `${baseId}-${fave.id}`

  		// if(!commentCount) // can be passed in or retrieved from here
				// getCommentCount()
		}
	}
	// })

	$: href = collection ? `/fave/${baseId}-${fave.id}?collection=${collection}` : `/fave/${baseId}-${fave.id}`



	// function thumbClick () {
	// 	console.log('thumbclick')
	// 	goto(`/fave/${baseId}-${fave.id}`)
	// }

	// function linkClick() {
	// 	// do nothing
	// 	// prevents thumbClick from triggering when clicking a link
	// }
	
  // onMount(async () => {
  // 	if(fave.fields['_phid']) {
  // 		profile = await getProfile(fave.fields['_phid'])
  // 		console.log('favethumb', fave.fields, profile)
  // 	}
  // })

  // mostly for testing; this is much more efficient on the grid-level than the item level (pass it in as a prop)
  $: if(!profile && process.browser === true && fave.fields['Added by']) {
		profile = getProfile(fave.fields['Added by'], fetch)
  }


	const getCommentCount = async () => {
		let _res = await fetch(`api/comments/count?locId=${faveId}`)
		if(_res.status == 200) {
    	commentCount = await _res.json()
		}
	} 



</script>






<style type="text/scss">

	a {
		// display: block;
		position: relative;
		// z-index: 1000;
	}

	.FaveThumb {
		display: relative;

		._hide-off {
			display: none;
		}
		&:hover {
			._hide-off {
				display: inline;
			}
		}
	}

	.FaveThumb-name {
	}

	.FaveThumb-profile {
		// margin-top: 0.5rem;

		a {
			text-decoration: none;
		}
	}

	:global(.FaveThumb-profile-img) {
		width: 25px;
		height: 25px;
		object-fit: cover;
		border-radius: 100%;
		margin-right: 0.25rem;
		vertical-align: middle;
	}
	.FaveThumb-cover-img {
		position: absolute;
		top: 0;
		right: 0;
		width: 150px;
		height: 90px;
		opacity: 0.18;
		object-fit: cover;
	}


	.FaveThumb-description-link {
		text-decoration: none;
		color: #333;
		&:hover, &:focus {
			color: #0163e4;
		}
	}


	.FaveThumb-description {
		// hide long descriptions?
		// this will stabilize the masonry's rag
	  white-space: nowrap;
	  text-overflow: ellipsis;
	  overflow: scroll;
	  max-height: 250px;
	}

</style>


