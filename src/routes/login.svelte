<svelte:head>
	<title>Login</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Log in</h1>

    <div class="_margin-top-2 _margin-bottom-2">
      {@html marked(intro||'')}
    </div>

    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="login">
      <form class="_form-control" on:submit|preventDefault={async (e)=>{
        if(!isLoading) {
          isLoading = true
				  _gatrack('login')
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
          <button class="_button __action _margin-right-none-i" type="submit">Log in</button>
        {:else}
          <button class="_button __action _margin-right-none-i">Logging in...</button>
        {/if}

        {#if _res && _res.status == false}
        	<p class="_message __error">{_res.message}</p>
        {/if}

      </form>


      <div class="_margin-top">
        <form class="_form-control" on:submit|preventDefault={(evt)=>handleOauth(evt,'twitter')}>
          <button class="_button __cta" type="submit">Log in with Twitter</button>
        </form>
      </div>

      <div class="_margin-top">
        <!-- {#if _res && _res.status == false} -->
          <p class=""><a class="_button __cta" href="/account/forgot-password">Reset your password</a></p>
        <!-- {/if} -->
      </div>

    </div>
  </div>
</div>
        




<script>
  import { handleOauth, handleLogin } from '../_utils/auth/sapper-auth-helpers';
  import { getUser } from '../_utils/auth/get-user';
  import { goto } from '@sapper/app';
	import { _gatrack } from '../_utils/gtag.js';
  
  import { onMount, getContext, setContext } from 'svelte';
  import marked from 'marked';

  let email = '', password = ''
  let isLoading = false, _res


  // Content passed down from layout
	import Cytosis from 'cytosis';
  const Content$ = getContext('Content')
  $: Content = $Content$
  let intro
	$: intro = Cytosis.findField('account-intro', Content, 'Content')

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




