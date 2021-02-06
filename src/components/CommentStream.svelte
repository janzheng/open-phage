<!-- 

	from tutorial: https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/

	Consolidated files since I hate component hell

 -->

{#if getSettingClient('comments', Content)}
	<div class="CommentBox {classes}">

		<div class="Comments">
			<h4 class="_margin-bottom">Comments {comments ? `(${comments.data.length})` : ''}</h4>

			{#if comments && comments.data.length > 0}
				{#each comments.data as item}
					{#await getProfileByPhid(item._phid) then profile}
						<div class="_card _padding">
							<div class="_grid-2 _align-vertically">
								<div class="">
									{#if profile && profile.data}
										<div class={`FaveThumb-profile`}>
											<a href={`/user/${profile.data.fields['Slug']}`}>
												{#if profile.data.fields['ProfileImage'] && profile.data.fields['ProfileImage'].length > 0 }
													<img class="FaveThumb-profile-img" alt={`profile for ${profile.data.fields['userName']}`} src={ profile.data.fields['ProfileImage'][0]['thumbnails']['small']['url'] }>
												{/if}
												<span class="FaveThumb-profile-username">{ profile.data.fields['userName'] }</span>
											</a>
										</div>
									{/if}
								</div>
								<div class="_font-small _right">{ getPrettyDate(item.ts) }</div>
							</div>
              <p class="_padding-top">{item.comment}</p>
              <p class="_padding-top _font-small">{item.locId} | {item.ref['@ref'].id}</p>
              
						</div>
					{/await}
				{/each}
			{/if}
		</div>



		{#if User && $User['Profile']}
			<form class="Formlet _padding-top-2" on:submit|preventDefault={async ()=> {
				isPosting=true
				await postComment()
				isPosting=false
			}}>
				<div class="Formlet Formlet-textarea _form-control">
					<label for="sigMessage" class="_form-label">Leave a comment
					<textarea id="sigMessage"
										ref="textarea"
										name="sigMessage"
										rows="2"
										class="_form-input _block" 
										type="text"
										bind:value={comment}
					/>
				</div>

				<div>
					<button type="submit" class="_button __width-full __action _margin-bottom-none">Say something nice!</button>
				</div>

				{#if message}
					<div class="_message __success _card _padding __flat _margin-top">
						{ message }
					</div>
				{/if}
			</form>

		{:else}
			<!-- <div class="_card __flat _padding">
				<a href="/login">Log in</a> to leave a comment
			</div> -->
		{/if}

	</div>

{/if}

















<script>

  import { goto, stores } from '@sapper/app';
  import { onMount, getContext } from 'svelte';
	import { User } from '../stores/stores.js';
	import { getSettingClient } from "../_utils/settings"

  import { getProfile } from '../_utils/auth/get-profile';
  import { fetchPost } from '../_utils/fetch-helpers';
  import { logger, logerror } from '../_utils/logger';


  // can be url, id slug, to tie these messages to a permalink, thread, etc.
  // if none provided, this is just a "general" message thread
  export let locationId, classes, loadAll=false
	let comments, comment, message, isPosting=false
	let user, userData // userData used to id user on Fauna using _phid
	let profile

  const Content = getContext('Content')
	

  onMount(async () => {
		if(loadAll)
			await loadAllComments()
		else
	  	await loadComments()
  })

	$: if(User && !$User['__isLoading']) {
  	userData = {
  		_phid: $User._phid,
  		id: $User.id,
  		userName: $User.userName
  	}
	}
	


	const getPrettyDate = (ts) => {
		const dateObj = new Date(ts / 1000);
		return `${dateObj.toLocaleString('default', {weekday: 'long'})}, ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()} at ${dateObj.toLocaleTimeString('default', {hour: '2-digit',minute: '2-digit', hour12: false})}`
	}


	const loadAllComments = async () => {

		// console.log('...loading comments from', locationId)
    comments = await fetch(`api/comments/all`, {
			headers: {'X-Skip-SWR': true},
		}).then(r => r.json())
		console.log('...loading all comments:', comments)
	} 


	const loadComments = async () => {
		if(!locationId)
			return

		// console.log('...loading comments from', locationId)
    comments = await fetch(`api/comments?locId=${locationId}`, {
			headers: {'X-Skip-SWR': true},
		}).then(r => r.json())
		// console.log('...loading comments:', comments)
	} 

	const getProfileByPhid = async (_phid) => {
		profile = await getProfile(_phid, fetch)
		return $profile
	} 

	const postComment = async () => {
		if(!locationId)
			return

		const data = {
			comment,
			locId: locationId
		}

		if(!comment) {
			message = "Don't forget to leave a nice comment!"
			return
		}

		try {

      const response = await fetchPost('/api/comments', data, fetch)
			// success
			if(response.status == 200) {
				const result = await response.json()
				loadComments() // reload messages, since no db stream
				comment = ''
				message = 'Message added!'
			}

			// error
			if(response.status == 400) {
				message = 'The comments server is currently offline'
				// url = ''
				// isLoading = false
			}

		} catch(err) {
			console.error('signature post error:', err)
			// error = err.message
			// isLoading = false
		}
	}



</script>


<style type="text/scss">


</style>




