
<div class="Breadcrumbs _padding-top _padding-bottom">
  <div class="_section-page _margin-center _padding-top-none-xs">
  	{#each links as link, i}<a rel=prefetch class="{link.classes} {link.active?'__active':''}" href={link.href}>{link.name}</a>{#if i < links.length-1}<span>{#if link.div}{link.div}{:else}<img class="bullet" width="30" src="/pgh_bullet_sm.png" alt="bullet"/>{/if}</span>{/if}{/each}
  </div>
</div>


<script>
	export let links
</script>

