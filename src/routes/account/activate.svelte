
<!-- 

	Rename this to "signup.svelte" to make it easier to access if you're using this route

 -->

<svelte:head>
  <title>Sign Up</title>
</svelte:head>



<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Sign Up</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="activate _divider-bottom">
      <!-- <form on:submit|preventDefault={handleSignupActivate}> -->
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleActivate(e, {email})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="email">Email
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="email"
            name="email"
            bind:value={email}
          />
        </label>

        {#if !isLoading}
          <button class="_button __action _margin-right-none-i" type="submit">Sign Up</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Signing up...</button>
        {/if}


        {#if _res && _res.status == false}
          <p class="_message __error">{_res.message}</p>
        {/if}
        
        {#if _res && _res.status == true }
          <p class="_message __success">{_res.message}</p>
        {/if}
        
      </form>


      <div class="_margin-top">
        <form class="_form-control" on:submit|preventDefault={(evt)=>handleOauth(evt,'twitter')}>
          <button class="_button __cta" type="submit">Sign up with Twitter</button>
        </form>
      </div>
      
    </div>
  </div>
</div>
        




<script>
  import { handleOauth, handleActivate } from '../../_utils/auth/sapper-auth-helpers';
  import { onMount } from 'svelte';
  import { getUser } from '../../_utils/auth/get-user';
  import { goto } from '@sapper/app';


  let email = ''
  let isLoading = false, _res

  onMount(async () => {
    let user = await getUser()
    if(user && user.status == true)
      goto('/')
  })


</script>










<style>
  form {
    display: flex;
    flex-flow: column;
  }
</style>




