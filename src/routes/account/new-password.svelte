<script context="module">
  export async function preload(page, session) {
    const { token } = page.query;
    return { token };
  }
</script>

<svelte:head>
	<title>Set a New Password</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Set a New Password</h1>


    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->
    <div class="new-password ">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleResetPassword(e, {password, token})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="token">Password Token
          <p class="_font-small">If you need a password token, <a class="_font-small" href="/account/forgot-password">click here to have a new one sent to your email.</a></p>
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="token"
            name="token"
            bind:value={token}
          />
        </label>

        <label class="_form-label _margin-bottom-2" htmlFor="password">New Password
          <input
            class="_width-full _margin-top-half"
            type="password"
            id="password"
            name="password"
            bind:value={password}
            autocomplete="new-password"
          />
        </label>



        {#if !isLoading}
          <button class="_button __action _margin-right-none-i" type="submit">Set the new password</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Changing password...</button>
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
  import { handleResetPassword } from '../../_utils/auth/sapper-auth-helpers';

  export let token
  let password = ''
  let isLoading = false, _res


</script>






<style>
  form {
    display: flex;
    flex-flow: column;
  }
</style>

