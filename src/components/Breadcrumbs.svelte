
<div class="Breadcrumbs _divider-bottom _padding-top _padding-bottom">
  <div class="_section-page _margin-center">
  	{#each links as link, i}<a rel=prefetch href={link.href}>{link.name}</a>{#if i < links.length-1}<span>{link.div || '⬡'}</span>{/if}{/each}
  </div>
</div>


<script>
	export let links
</script>