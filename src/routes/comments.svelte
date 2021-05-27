<svelte:head>
	<title>Profile</title>
</svelte:head>


<!-- <div class="_section-page _padding-top-2 _margin-center"> -->
<div class="">
  <div class="_section-article _margin-center">
    <div class="_margin-top-2">

      {#if user && user.status !== false && user['Authorizations'] && user['Authorizations'].includes('Allow::Moderation')}
        <CommentMod classes="Discussion _padding _card _margin-top-2 _flex-1" loadAll={true} />
      {:else}
        Please log in to view the comment stream
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

	import CommentMod from '../components/CommentMod.svelte'
  import ProfileCourseBookmarks from '../components/ProfileCourseBookmarks.svelte';

  import { User } from '../stores/stores.js';


  // for Profile preview
  let isEditing = false, user
  setContext('User', User)

  onMount(async () => {
  	user = await getUser()

  	// if(!user || user.status == false)
    //   handleLogout()

    User.set(user)
  })

</script>








<style type="text/scss">


</style>






