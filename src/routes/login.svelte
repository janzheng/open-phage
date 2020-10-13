<svelte:head>
	<title>Login</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Log in</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="login _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleLogin(e,{email, password})
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

        <label class="_form-label _margin-bottom-2" htmlFor="password">Password
          <input
            class="_width-full _margin-top-half"
            type="password"
            id="password"
            name="password"
            bind:value={password}
            autocomplete="current-password"
          />
        </label>

        {#if !isLoading}
          <button class="_button __action __width-full _margin-right-none-i" type="submit">Log in</button>
        {:else}
          <button class="_button __action __width-full _margin-right-none-i">Logging in...</button>
        {/if}

        {#if _res && _res.status == false}
        	<p class="_message __error">{_res.message}</p>
          <p class="_message __success"><a href="/account/forgot-password">Reset your password</a></p>
        {/if}

      </form>


      <div class="_margin-top">
        <form class="_form-control" on:submit|preventDefault={(evt)=>handleOauth(evt,'twitter')}>
          <button class="_button __width-full __cta" type="submit">Log in with Twitter</button>
        </form>
      </div>

    </div>
  </div>
</div>
        




<script>
  import { handleOauth, handleLogin } from '../_utils/auth/sapper-auth-helpers';
  import { onMount } from 'svelte';
  import { getUser } from '../_utils/auth/get-user';
  import { goto } from '@sapper/app';

  let email = '', password = ''
  let isLoading = false, _res

  onMount(async () => {
    let user = await getUser()
    if(user && (user.status == true || user.id))
      goto('/')
  })


</script>











<style>
  form {
    display: flex;
    flex-flow: column;
  }
</style>




