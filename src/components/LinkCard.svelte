
{#if item}
	<div class="list-block-container"> 
		<a rel=prefetch class="list-block-link" href={item.fields['URL']}>
			<div class="list-block-item-container list-card _card _padding-top-2 _padding-bottom-2">
				{#if item.fields['Cover Image']}
					<img alt="item cover img" class="list-block-cover" src={ item.fields['Cover Image'][0] }>
				{/if}
				<p data-field="Name">{ item.title[0][0] }</p>

				{#if item.fields['Author']}
					<p data-field="Author">{ item.fields['Author'] }</p>
				{/if}

				{#if item.fields['Description']}
					<p data-field="Description">{ item.fields['Description'] }</p>
				{/if}
			</div>
		</a>
	</div>

{/if}



<script>

	export let item

	// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	$: console.log(item)


</script>

<style>
</style>