<script>
  import { onMount, getContext, setContext } from 'svelte';

  import Cytosis from 'cytosis'
  import marked from 'marked'

	import { getSettingClient } from "../_utils/settings"
	import { handleLogout } from '../_utils/auth/sapper-auth-helpers';

  export let segment

  const Content = getContext('Content')

  // $: if(Content) {
  // console.log('Content:', Content)
  let content
  $: content = Cytosis.findOne('header', $Content ).fields['Markdown']
  // }

  const User = getContext('User')
  $: if($User) {
  	console.log('[Nav] User / Profile:', $User, $User.Profile)
  }


</script>
<!--
<nav>
	<ul>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
		<li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li>

		<!~~ for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen ~~>
		<li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li>
	</ul>
</nav>

-->

<!-- 
<nav class="Header">
	Some nav stuff
</nav>

 -->

<nav class="Header __antialiased __content-header">
	<div class="skip"><a href="#main">Skip to main content</a></div>
  <div class="Nav Home-content _section-page _padding-top-2 _padding-bottom-2 _margin-center">

  	<!-- segment: { segment } -->
    <!-- {@html marked(content)} -->
  	<div class="_grid-1-5-sm _align-vertically">
    	<div>
    		<a rel=prefetch href="/"><img width="50px" src="icon_pd.png" alt="logo for home"></a>
    	</div>
    	<div class="_padding-top-2-xs _padding-left-2-sm _md-pfix">
    		<div class="_flex _flex-right">
    			<a rel=prefetch href="/lectures" class={`__underline-none ${segment==='lectures'?'_active':''}`}>Lectures</a>
    			<a rel=prefetch href="/library" class={`__underline-none ${segment==='library'?'_active':''}`}>Library</a>
					<!-- <a href="/about">About</a> -->
					
					{#if getSettingClient('account', Content)}
						<div>
							{#if !$User || !$User.Profile}
								<a rel=prefetch href="/login" class={`__underline-none ${segment==='login'?'_active':''}`}>Log in</a>
								{#if getSettingClient('signup', Content)}
									<a rel=prefetch href="/signup" class={`__underline-none ${segment==='signup'?'_active':''}`}>Sign up</a>
								{/if}
							{:else}
								<a rel=prefetch class={`__underline-none ${segment === "profile" ? "selected" : ""}`} href='profile'>{$User.Profile.fields.userName}</a>
								<a href="/" class="__underline-none _item logout __text _margin-bottom-none-i" on:click={handleLogout} >Log out</a>
							{/if}
						</div>
					{/if}
    		</div>
    	</div>
    </div>
  </div>
</nav>


<style type="text/scss">
	:global(.Header) {
		background-color: white;
		position: relative;
		z-index: 100;
	}

	:global(.phaves-title) {
		padding: 0;
	}

	.Nav {
		/*background-color: #E7FBFF;*/
		padding-top: 1rem * 1.3;
		padding-bottom: 1rem * 1.3;
	}

	a { 
		padding-right: 1rem;
		font-size: 1.1rem;

		&:last-child {
			padding-right: 0;
		}

		&._active {
			font-weight: bold;
		}
	}

	@media (max-width: 768px) {
		._flex-right {
	  	justify-content: normal !important;
		}
	}

	.skip {
		position: relative;
		opacity: 0;
		height: 0;
	}
</style>




