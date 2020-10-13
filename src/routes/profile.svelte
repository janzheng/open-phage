<svelte:head>
	<title>Profile</title>
</svelte:head>


<!-- <div class="_section-page _padding-top-2 _margin-center"> -->
<div class="">
  <div class="_section-article _margin-center">
    <div class="_divider-top">
      <h1>Profile</h1>

      <!-- if user's profile exists -->
      {#if $User && $User.Profile}
        <div class="Profile-preview _margin-bottom-2">
          <div class="_section-article _margin-center">
            <ProfileRender userProfile={true} />
          </div>
        </div>

        <div class="Profile-edit _margin-bottom-2">
          <div class="Profile-edit-toggle">
            <button class="__button __action" on:click={()=>{isEditing=!isEditing}}>Edit Profile</button>
          </div>
          {#if isEditing}
            <ProfileEdit />
          {/if}
        </div>

        <div class="Profile-bookmarks _margin-bottom-2">
          <h2>Best Of</h2>
          <ProfileBookmarks />
        </div>

        <div class="Profile-faves _margin-bottom-2">
          <h2>Bookmarks</h2>
          <ProfileFaves profile={$User.Profile} />
        </div>

      {/if}
    </div>
  </div>

</div>
        



<script>
  import { goto, stores } from '@sapper/app';
  import { setContext, onMount, tick } from 'svelte';
  import { writable } from 'svelte/store'

  import { handleLogout } from '../_utils/auth/sapper-auth-helpers';
  import { logger, logerror } from '../_utils/logger';
  import { getUser } from '../_utils/auth/get-user';

  import ProfileRender from '../components/ProfileRender.svelte';
  import ProfileEdit from '../components/ProfileEdit.svelte';
  import ProfileFaves from '../components/ProfileFaves.svelte';
  import ProfileBookmarks from '../components/ProfileBookmarks.svelte';

  import { User } from '../stores/stores.js';


  // for Profile preview
  let isEditing = false
  setContext('User', User)

  // onMount(async () => {
  // 	let user = await getUser()


  // 	if(!user || user.status == false)
  //     handleLogout()

  //   User.set(user)
  // })

</script>













<style type="text/scss">


</style>






