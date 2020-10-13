<script context="module">
  export async function preload(page, session) {
    const { token } = page.query;
    return { token };
  }
</script>



<svelte:head>
  <title>Activate Account</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Activate Account</h1>

    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="activate _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleActivateAuth(e, {token})
          isLoading = false
        }
      }}>
        <label class="_form-label _margin-bottom-2" htmlFor="token">Token
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="token"
            name="token"
            bind:value={token}
          />
        </label>

        <!-- this should be done after the account is verified -->
<!-- 
        <label class="_form-label _margin-bottom-2" htmlFor="username">User name
          <input
            class="_width-full _margin-top-half"
            type="text"
            id="username"
            name="username"
            bind:value={userName}
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
 -->

        {#if !isLoading}
          <button class="_button __action _margin-right-none-i" type="submit">Activate Account</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Activating...</button>
        {/if}


        {#if _res && _res.status == false}
          <p class="_message __error">{_res.message}</p>
        {/if}
        
      </form>
    </div>
  </div>
</div>
        




<script>
  import { handleActivateAuth } from '../../_utils/auth/sapper-auth-helpers';
  import { onMount } from 'svelte';


  export let token
  // let password = '', userName = ''
  let isLoading = false, _res

  onMount(async () => {
    if(token) {
      isLoading = true
      _res = await handleActivateAuth(document.createEvent('Event'), {token})
      isLoading = false
    }
  });


  // const handleActivateAccount = async (event) => {
  //   event.preventDefault()

  //   try {
  //     const response = await fetch(`/api/passport/activate/${token}`)
  //     isLoading = false

  //     if(response.status == 200) {
  //       const result = await response.json()
  //       // console.log('Account activation response:', result)
  //       logger('[handleActivateAccount]', 'Account activation response:', result)
  //       if(results.user)
  //         user = results.user
  //     }

  //   } catch (err) {
  //     error = err
  //     console.error(err)
  //     logerror('[handleActivateAccount]', 'Error:', err)
  //     return
  //   }
  // }
</script>





<style>

  form {
    display: flex;
    flex-flow: column;
  }
</style>





