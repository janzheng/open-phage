<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	h1, p {/*
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}*/
	}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<div class="Error">

  <div class="_section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _divider-top _divider-bottom">

    	<!-- {#if status !== 500} -->
				<h1>{status}</h1>

				{#if error.message}
					<p>{error.message}</p>
				{/if}

				{#if dev && error.stack}
					<pre>{error.stack}</pre>
				{/if}
			<!-- {:else}
				<h1>Browser Offline</h1>

				<p>Please re-connect to the internet to view this page</p>
			{/if} -->

    </div>
  </div>
</div>
