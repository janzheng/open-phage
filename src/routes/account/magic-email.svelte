<script context="module">
  export async function preload(page, session) {
    const { token } = page.query;
    return { token };
  }
</script>



<svelte:head>
  <title>Log in with email</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Log in with email</h1>


    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->
    <div class="magic-email _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleMagicAuth(e, {token})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="token">Email Token
          <p class="_font-small">If you need a password token, <a class="_font-small" href="/account/magic">click here to have a new one sent to your email.</a></p>
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="token"
            name="token"
            bind:value={token}
          />
        </label>


        {#if !isLoading}
          <button class="_button __action _margin-right-none-i" type="submit">Log in with token</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Logging in...</button>
        {/if}

        {#if _res && _res.status == false}
          <p class="_message __error">{_res.message}</p>
        {/if}

        {#if _res && _res.status == true }
          <p class="_message __success">{_res.message}</p>
        {/if}
        
        
      </form>
    </div>
  </div>
</div>
        




<script>
  import { handleMagicAuth } from '../../_utils/auth/sapper-auth-helpers';
  import { onMount } from 'svelte';

  export let token
  let password = ''
  let isLoading = false, _res

  onMount(async () => {
    if(token) {
      isLoading = true

      console.log('auto token login')
      _res = await handleMagicAuth(document.createEvent('Event'), {token})
      isLoading = false
    }
  });

</script>






<style>
  form {
    display: flex;
    flex-flow: column;
  }
</style>

