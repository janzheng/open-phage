<svelte:head>
  <title>Sign Up</title>
</svelte:head>



<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Sign Up</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="signup _divider-bottom ">
      <!-- <form on:submit|preventDefault={handleSignupActivate}> -->
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleSignup(e, {userName, email, password})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="username">User name
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="username"
            name="username"
            bind:value={userName}
          />
        </label>

        <label class="_form-label _margin-bottom-2" htmlFor="email">Email
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="email"
            name="email"
            bind:value={email}
          />
        </label>

        <label class="_form-label _margin-bottom-2" htmlFor="password">Password
          <input
            class="_width-full _margin-top-half"
            type="password"
            id="password"
            name="password"
            autocomplete="new-password"
            bind:value={password}
          />
        </label>


        {#if !isLoading}
          <button class="_button __action __width-full _margin-right-none-i" type="submit">Sign Up</button>
        {:else}
          <button class="_button __action __width-full _margin-right-none-i">Signing up...</button>
        {/if}


        {#if _res && _res.status == false}
          <p class="_message __error">{_res.message}</p>
        {/if}
        
      </form>


      <div class="_margin-top">
        <form class="_form-control" on:submit|preventDefault={(evt)=>handleOauth(evt,'twitter')}>
          <button class="_button __width-full __cta" type="submit">Sign up with Twitter</button>
        </form>
      </div>
      
    </div>
  </div>
</div>
        




<script>
  import { handleOauth, handleSignup } from '../_utils/auth/sapper-auth-helpers';
  import { onMount } from 'svelte';
  import { getUser } from '../_utils/auth/get-user';


  let email = '', password = '', userName = ''
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




