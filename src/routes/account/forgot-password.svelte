<script context="module">
  export async function preload(page, session) {
    const { email } = page.query;
    return { email };
  }
</script>


<svelte:head>
	<title>Forgot Password</title>
</svelte:head>

<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Forgot Password</h1>

    <div class="forgot _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleForgot(e,{email})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="token">Email
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="email"
            name="email"
            bind:value={email}
          />
        </label>

        {#if !isLoading}
          <button class="_button __action _margin-right-none-i" type="submit">Send Password Reset</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Resetting password...</button>
        {/if}

        {#if _res && _res.status == false }
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
  import { goto, stores } from '@sapper/app';
  import { handleForgot } from '../../_utils/auth/sapper-auth-helpers';

  export let email = '' 
  let isLoading = false, _res

</script>




<style>

  form {
    display: flex;
    flex-flow: column;
  }
</style>




