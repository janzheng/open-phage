<!-- 

	from tutorial: https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/

	Consolidated files since I hate component hell

 -->

<div class="CommentBox">

	<div class="Comments">
		<h4 class="_padding-top-none-i _margin-bottom">Comments</h4>

    {#if comments && comments.data.length > 0}
			{#each comments.data as item}
				<div class="_card _padding">
					<div class="_grid-2 _align-vertically">
						<div class="">
							{#if $profiles[item._phid] && $profiles[item._phid].data}
								<div class={`CommentBox-profile`}>
									<a href={`/user/${$profiles[item._phid].data.fields['userName']}`}>
										{#if $profiles[item._phid].data.fields['ProfileImage'] && $profiles[item._phid].data.fields['ProfileImage'].length > 0 }
											<img class="CommentBox-profile-img" alt={`profile for ${$profiles[item._phid].data.fields['userName']}`} src={ $profiles[item._phid].data.fields['ProfileImage'][0]['thumbnails']['small']['url'] }>
										{/if}
										<span class="CommentBox-profile-username">{$profiles[item._phid].data.fields['userName'] }</span>
									</a>
								</div>
							{/if}
						</div>
						<div class="_font-small _right">{ getPrettyDate(item.ts) }</div>
					</div>
					<p class="_padding-top">{item.comment}</p>
				</div>
			{/each}
		{:else}
			<div class="_card __flat _padding _padding-top-2 _padding-bottom-2">
				Be the first to leave a comment!
			</div>
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
				<div class="_message __success _margin-top">
					{ message }
				</div>
			{/if}
		</form>

	{:else}
		<div class="_card __flat _padding _margin-bottom-none">
			<a href="/login">Log in</a> to leave a comment
		</div>
	{/if}

</div>






















<script>

  import { onMount, onDestroy } from 'svelte';
	import { User } from '../stores/stores.js';
	import { writable } from 'svelte/store';

  import { getProfile } from '../_utils/auth/get-profile';
  import { fetchPost } from '../_utils/fetch-helpers';
  import { logger, logerror } from '../_utils/logger';


  // can be url, id slug, to tie these messages to a permalink, thread, etc.
  // if none provided, this is just a "general" message thread
  export let locationId
	let comments, comment, message, isPosting=false
	let user, userData // userData used to id user on Fauna using _phid
	let profile 
	let profileStores=[] // stores a bunch of profile swr subscriptions, will need to be unsubbed
	let profiles = writable({})

  onMount(async () => {
  	await loadComments()
  })

  onDestroy(() => {
  	profileStores.map(unsub=>{
  		unsub() // unsubscribe all the profiles
  	})
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

	const loadComments = async () => {
    comments = await fetch(`api/comments?locId=${locationId}`).then(r => r.json())
	} 

 	$: if (comments && comments.data.length > 0) {
		let _profiles = comments.data.map((item) => {

			// habe to subscribe to each profile object and assign it to a reactive store
			let profile = getProfile(item._phid, fetch, false, true)
			
			let unsub = profile.subscribe(v=>{
				profiles.update(state=>{
					state[item._phid] = v
					return state
				})
			})
			profileStores.push(unsub)


		})
	}



	const postComment = async () => {
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

	.ProfileImage {
		object-fit: cover;
		border-radius: 100%;
		width: 48px;
		height: 48px;
		vertical-align: middle;
		margin-right: 16px;
	}



	.CommentBox-profile {
		// margin-top: 0.5rem;

		a {
			text-decoration: none;
		}
	}

	.CommentBox-profile-img {
		object-fit: cover;
		border-radius: 100%;
		width: 48px;
		height: 48px;
		vertical-align: middle;
		margin-right: 1rem;
	}


</style>




