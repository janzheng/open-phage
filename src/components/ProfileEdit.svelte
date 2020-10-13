
<div class="ProfileEdit">
	<!-- 
  <div class="_grid-2 _margin-bottom-2">
    <form on:submit|preventDefault={handleSaveProfile}>
      <button class="_button __action" type="submit">Save Changes</button>
    </form>
	  {#if onChanged}
	    <div class="_card _padding _margin-bottom-2">You've made changes! Don't forget to save!</div>
	  {/if}
  </div> -->


  {#if user}

	  <form id="profileForm">

	    <!-- <label htmlFor="Title">Title
	      <input
	        type="text"
	        id="Title"
	        name="Title"
	        bind:value={Title}
	        on:input={triggeronChanged}
	      />
	    </label>
	    <label htmlFor="Name">Name
	      <input
	        type="text"
	        id="Name"
	        name="Name"
	        bind:value={Name}
	        on:input={triggeronChanged}
	      />
	    </label> -->

	    <!-- <label htmlFor="CustomSlug">Custom Slug
	      <input
	        type="email"
	        id="CustomSlug"
	        name="CustomSlug"
	        bind:value={CustomSlug}
	        on:input={triggeronChanged}
	      />
	    </label>
	    <div class="Slug _margin-bottom-2">
	      Your slug is currently set as: { Slug }  
	    </div> -->

	    <div class="_grid-2 _grid-gap-large _margin-bottom-2">
	      <label class="_width-full" htmlFor="Files">Upload new profile image
	        <input
	        	class="_margin-right-none _width-full"
	          type="file"
	          id="Files"
	          name="Files"
	          bind:files
	          on:input={triggeronChanged}
	        />
	        {#if files && files.length > 0}
	          <div class="_padding _card _margin-bottom-2">{files[0].name}</div>
	        {/if}
	      </label>

	      <label class="" htmlFor="CustomSlug">Update profile image from URL
	        <input
	        	class="_margin-right-none _width-full"
	          type="text"
	          id="AvatarURL"
	          name="AvatarURL"
            placeholder="https://image.url.com"
	          bind:value={avatarUrl}
	          on:input={triggeronChanged}
	        />
	      </label>
	    </div>



	    <!-- <label htmlFor="PublicEmail">Public Email
	      <input
	        type="email"
	        id="PublicEmail"
	        name="PublicEmail"
	        bind:value={PublicEmail}
	        on:input={triggeronChanged}
	      />
	    </label> -->

	    <label class="_margin-bottom-2" htmlFor="userName">User Name
	      <input
	        class="_width-full"
	        type="text"
	        id="userName"
	        name="userName"
	        bind:value={user['Profile'].fields['userName']}
	        on:input={triggeronChanged}
	      />
	    </label>

      <label class="_margin-bottom-2" htmlFor="email">Account Email
        <p class="_font-small">This email is used for account management and password resets, and will not be shared publicly. If you change your email, you will need to log in again.</p>
        <input
          class="_width-full"
          type="text"
          id="email"
          name="email"
          bind:value={user['email']}
          on:input={triggeronChanged}
        />
      </label>

      <div class="_margin-bottom-2">Reset Password
        {#if !user['email']}
          <p class="_font-small">Add your email address first, then reset your password from the log in screen.</p>
        {:else}
          <p class="">Change your password by <a href={`/account/forgot-password?email=${user['email']}`}>sending a password reset to your email address</a></p>
        {/if}
      </div>

	    <label class="_margin-bottom-2" htmlFor="Pitch">Short Description
	      <textarea
	        class="_width-full"
	        id="Pitch"
	        name="Pitch"
	        bind:value={user['Profile'].fields['Pitch']}
	        on:input={triggeronChanged}
	      />
	    </label>

	    <!-- <label htmlFor="Social">Social (paste social media links here, we'll do the rest)
	      <textarea
	        type="text"
	        id="Social"
	        name="Social"
	        rows=4
	        bind:value={Social}
	        on:input={triggeronChanged}
	      ></textarea>
	      {#if socialProfiles}
	        <div class="_card _padding">
	          <SocialBox email={PublicEmail} socialProfiles={socialProfiles} />
	        </div>
	      {/if}
	    </label> -->

	    <!--<label htmlFor="CV">CV (paste in Markdown)
	      <textarea
	        type="text"
	        id="CV"
	        name="CV"
	        rows=8
	        bind:value={CV}
	        on:input={triggeronChanged}
	      ></textarea>
	      <!~~ add a social media preview here ~~>
	    </label>-->
	  </form>

    <div class="_margin-bottom-2">
      <form on:submit|preventDefault={async ()=>{
        isLoading = true
        await handleSaveProfile()
        isLoading = false
      }}>

        {#if !isLoading}
          <button class="_button __action _margin-bottom-none-i" type="submit">Save Changes</button>
        {:else}
          <button class="_button __action _margin-bottom-none-i" type="submit">Saving Changes...</button>
        {/if}

        {#if onChanged}
          <span class="">You've made changes! Don't forget to save!</span>
        {/if}
        {#if onSaved}
          <span class="">Changes saved!</span>
        {/if}
      </form>


      {#if _res && _res.status == false}
        <div class="_margin-top">
          <p class="_message __error">{_res.message}</p>
        </div>
      {/if}
      
    </div>


	{/if}


</div>




<script>
  import { goto, stores } from '@sapper/app';
  import { setContext, getContext, onMount, tick } from 'svelte';

  import { logger, logerror } from '../_utils/logger';
  import { getUser } from '../_utils/auth/get-user';
  import { fetchPost, fetchPostForm } from '../_utils/fetch-helpers';
  import { handleLogout } from '../_utils/auth/sapper-auth-helpers';
  // import { handleSaveProfile } from '../_utils/app-helpers';
  import { socialParse } from '../_utils/social-parse.js'
  import ProfileRender from '../components/ProfileRender.svelte';


  import SocialBox from '../components/SocialBox.svelte'

  let isLoading = false, error, token = '', user, files, avatarUrl
  let onChanged = false, onSaved = false, _res

	let User = getContext('User') 
  // used throughout profile editor; needs to be refreshed
  // this might be hard to debug later


	// $: if($User && $User.Profile) {


	// }

  // $: if(files) {
  //   console.log('Files:', files, typeof files)
  // }

  async function triggeronChanged() {
    await tick() // update on next tick
    onChanged = true

    // update temp avatar
    if(previewImage || (avatarUrl && avatarUrl.length > 0))
    	user['Profile'].fields['previewImage'] = previewImage || avatarUrl
    else 
    	user['Profile'].fields['previewImage'] = null

    $User = user
  }

  // profile items
  // turn this into one object? this seems hard to scale
  // let Name, PublicEmail, Social, Pitch, Title, CV, Slug, CustomSlug, userName


  
  let socialProfiles, socialText // parsed social profiles
  let previewImage // generated preview image for user


  // async function initData() {
  //   await tick()
  //   if (user && user['Profile']) {
  //     // Name = user['Profile'].fields['Name']
  //     // PublicEmail = user['Profile'].fields['PublicEmail']
  //     // Social = user['Profile'].fields['Sidebar::Social']
  //     // Pitch = user['Profile'].fields['Pitch']
  //     // Title = user['Profile'].fields['Title']
  //     // CV = user['Profile'].fields['CV']
  //     // socialProfiles = socialParse(Social); socialProfiles=socialProfiles // reactive
  //     // Slug = user['Profile'].fields['Slug']
  //     // CustomSlug = user['Profile'].fields['Slug::Custom']
  //     // userName = user['Profile'].fields['userName']

  //     // this is super annoying since it keeps uploading a new file
  //     // avatarUrl = user['Profile'].fields['ProfileImage'] ? user['Profile'].fields['ProfileImage'][0]['url'] : undefined 
  //   }
  //   user['Profile'] = user['Profile'] // reactive profile
  //   onChanged = false
  // }

  onMount(async () => {
  	user = await getUser()

  	if(!user)
  		goto('/login')

    // initData()
    // update the context user w/ fresh user data
    if(user)
    	$User = user

  })


  // update social on update
  // $: if(socialText) {
  //   socialProfiles = socialParse(socialText); socialProfiles=socialProfiles // reactive
  // }

  // $: if(CustomSlug) { // update the displayed slug if user enters a custom slug
  //   Slug = CustomSlug || Slug
  // }

  $: if(files) { // generate preview image from the upload and send it to the profile render box
    if(files && files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage = e.target.result
        // console.log('previewImage:', previewImage, files[0], e)
        triggeronChanged()
      }
      reader.readAsDataURL(files[0])
    }
  }

  const uploadAvatar = async (recordId) => {
    fetchPostForm('/api/profile/avatar', {recordId, avatar: files[0]}, fetch)
  }



  const handleSaveProfile = async () => {
    onChanged = false

    const data = {
      'profile': {
        recordId: user['Profile'].id,
        // 'Sidebar::Social': Social, 
        // 'Slug::Custom': CustomSlug, 
        'ProfileImage': avatarUrl,
        'userName': user['Profile'].fields['userName'],
        'Pitch': user['Profile'].fields['Pitch'],
      },
      recordId: user['Profile'].id,
      'email': user['email'],
      // Name, PublicEmail, Pitch, Title, CV, userName
    }

    try {
      const response = await fetchPost('/api/profile', data, fetch)

      if(response.status == 200) {
        _res = await response.json()

        if(_res.status == false) {
          console.error('boopadoop', _res)
          return
        }

        logger('[handleSaveProfile]', 'Saved!', _res.data)

        if(files && files.length > 0)
          uploadAvatar(user['Profile'].id)

        // update user store
        let _user = await getUser()
        if(!_user || _user.status == false) {
          await handleLogout()
          goto('/')
          return
        }

        user = _user
        user['Profile'] = _res.data
        $User = user
        onSaved = true
      }

    } catch (err) {
      error = err
      console.error(err)
      return
    }
  }

</script>










<style type="text/scss">

input[type=file] {
  padding: 0.5rem;
  line-height: 1rem;
}
</style>


