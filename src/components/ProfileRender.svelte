

<svelte:head>
	<title>{siteTitle}</title>
	<link rel="icon" sizes="192x192" href={previewImage || profileImage}>
  <meta property="og:image" content={previewImage || profileImage} > 
  <meta name="twitter:image" content={previewImage || profileImage} >
  <link rel="icon" type="image/png" sizes="192x192" href={previewImage || profileImage}>
</svelte:head>


<div class="ProfileRender">

	<!-- <header class="Profile-header"></header> -->

	{#if Profile}
		<article class="ProfileRender-card _card _padding-2 _center">
			{#if previewImage || profileImage}
				<img class="ProfileRender-image" src={previewImage || profileImage} alt={`${name} profile`}/>
			{:else}
				<!-- deliberately empty -->
				<div class="ProfileRender-imagePlaceholder"></div>
			{/if}
			<div class="ProfileRender-username _margin-top-2">{Profile.fields['userName'] || 'username'}</div>
			<div class="ProfileRender-description">{@html marked(Profile.fields['Pitch'] || '')}</div>
			<SocialBox email={email} socialProfiles={socialProfiles} />


      {#if Profile.fields['Slug']}
        <div class="ProfileRender-slug _margin-top-2">
          View profile at <a href={`/user/${Profile.fields['Slug']}`} target="_blank">{`/user/${Profile.fields['Slug']}`}
        </div>
      {/if}

		</article>
	{/if}

</div>









<script>
	import marked from 'marked'
  import { getContext } from 'svelte';
	import SocialBox from '../components/SocialBox.svelte'
	// import { render } from '../_utils/markdownit.js'
	import { socialParse } from '../_utils/social-parse.js'

	let User = getContext('User')
	export let Profile // could either be passed in or gotten from User

	export let previewImage, userOwnsProfile // generated from an uploaded image through file reader

	let name, email, siteTitle, profileImage, pitch, socialProfiles, cvContent, userName
	
	// if we have a User from the store, we set profile to that
	// but only if we haven't passed in Profile as a prop
	// $: if(!Profile && $User && $User.Profile) { // this prevents future updates
	$: if(userOwnsProfile && $User) {
		Profile = $User.Profile
	} 

	// $: console.log('profileRender User:', $User)


	// if profile exists as a prop or from store, fill it out
	$: if(Profile) {
		name = Profile.fields['Name'] || 'Jane Doe'
		siteTitle = name || ''
		profileImage = Profile.fields['ProfileImage'] ? Profile.fields['ProfileImage'][0]['url'] : undefined
		pitch = Profile.fields['Pitch']
		email = Profile.fields['PublicEmail']

		if(Profile.fields['Title'])
			siteTitle = `${Profile.fields['Name']}, ${Profile.fields['Title']}`

		// console.log('Profile::', Profile.fields)
		socialProfiles = socialParse(Profile.fields['Sidebar::Social'])
		cvContent = Profile.Notion ? Profile.Notion['content'] : Profile.fields['CV']

		// console.log('socialSidebar:', socialProfiles)
		previewImage = Profile.fields['previewImage'] 
		// console.log('previewImage:', previewImage)
	}


</script>





<style type="text/scss">


</style>







