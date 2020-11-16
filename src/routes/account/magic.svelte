

<svelte:head>
  <title>Magic Link Log in</title>
</svelte:head>



<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Log in with email</h1>

    <div class="login-magic _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
          _res = await handleMagicLogin(e,{email})
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
          <button class="_button __action _margin-right-none-i" type="submit">Send log in link</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Sending log in link...</button>
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
          <button class="_button __cta" type="submit">Log in with Twitter</button>
        </form>
      </div>
      
    </div>
  </div>
</div>




<script>
  import { onMount } from 'svelte';
  import { handleMagicLogin, handleOauth } from '../../_utils/auth/sapper-auth-helpers';
  import { getUser } from '../../_utils/auth/get-user';

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








