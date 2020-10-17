
{#if $User}
	<div class={`${classes} UserSliver`}>
		{#if isBkmk}
			<span>🌟 {#if showText}Bookmarked{/if}</span>
		{/if}
	</div>
{/if}


<script>
	import { User } from '../stores/stores.js';
  import {isBookmark, handleAddLectureBookmark, handleRemoveLectureBookmark} from '../_utils/app-helpers'

  export let classObj, url, classes, showText=true
  let isBkmk

	$: if($User && !$User.__isLoading) {
		isBkmk = isBookmark(url || classObj.fields['URL'])
	}



</script>