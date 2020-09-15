
{#if protocol}
	<div class="list-block-container"> 
		<a class="list-block-link" href={protocol.fields['URL']}>
			<div class="list-block-item-container _card _padding">
				{#if protocol.fields['Cover Image']}
					<img alt="protocol cover img" class="list-block-cover" src={ protocol.fields['Cover Image'][0] }>
				{/if}
				<p data-field="Name">{ protocol.title[0][0] }</p>

				{#if protocol.fields['Author']}
					<p data-field="Author">{ protocol.fields['Author'] }</p>
				{/if}

				{#if protocol.fields['Description']}
					<p data-field="Description">{ protocol.fields['Description'] }</p>
				{/if}
			</div>
		</a>
	</div>

{/if}



<script>

	export let protocol

// $list {"class": "test-list", "itemContainerClass": "_card _padding", "coverField":"Cover Image", "showFields": "Name, Author, Description, DOI", "linkField":"URL"}

	$: console.log(protocol)


</script>

<style>
</style>