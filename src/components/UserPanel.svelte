
{#if $User}
	<!-- <div class="UserPanel _card __flat _padding"> -->
	<div class="UserPanel {classes}">
		{#if isBkmk}
			<button class="_button __quiet _margin-bottom-none-i" on:click={handleRemoveLectureBookmark(classObj.fields['URL'])}>🌟 &nbsp;&nbsp; Remove from your bookmarks</button>
		{:else}
			<button class="_button __quiet _margin-bottom-none-i" on:click={handleAddLectureBookmark(classObj.fields['URL'])}>⭐️ &nbsp;&nbsp; Add to your bookmarks</button>
		{/if}
	</div>
{/if}


<script>
	import { User } from '../stores/stores.js';
  import {isBookmark, handleAddLectureBookmark, handleRemoveLectureBookmark} from '@/_project/app-helpers'

  export let classObj, classes
  let isBkmk

	$: if($User && !$User.__isLoading) {
		isBkmk = isBookmark(classObj.fields['URL'])
		// console.log('?!?!?!!?', isBkmk)
	}



</script>