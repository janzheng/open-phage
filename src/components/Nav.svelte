<script>
  import { onMount, getContext, setContext } from 'svelte';

  import Cytosis from 'cytosis'
  import marked from 'marked'

  const Content$ = getContext('Content')
  $: Content = $Content$

  // $: if(Content) {
  // console.log('Content:', Content)
  let content
  $: content = Cytosis.findOne('header', Content ).fields['Markdown']
  // }

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
    <!-- {@html marked(content)} -->
  	<div class="_grid-1-5-sm _align-vertically">
    	<div>
    		<a rel=prefetch href="/"><img width="50px" src="logo.png" alt="logo for home"></a>
    	</div>
    	<div class="_padding-top-2-xs _padding-left-2-sm _md-pfix">
    		<div class="_flex _flex-right">
    			<a rel=prefetch href="/lectures">Lectures</a>
    			<a rel=prefetch href="/library">Library</a>
    			<!-- <a href="/about">About</a> -->
    			<div>
  					<a rel=prefetch href="/login">Login</a>
  					<a rel=prefetch class="" href="/login#signup">Signup</a>
  				</div>
    		</div>
    	</div>
    </div>
  </div>
</nav>



<style>
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

	}

	@media (max-width: 640px) {
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










<!-- 

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	 clearfix 
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
 -->