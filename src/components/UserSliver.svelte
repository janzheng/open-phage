
{#if $User}
	{#if isBkmk}
		<div class={`${classes} UserSliver`}>
				<span>🌟 {#if showText}Bookmarked{/if}</span>
		</div>
	{/if}
{/if}


<script>
	import { User } from '../stores/stores.js';
  import {isBookmark, handleAddLectureBookmark, handleRemoveLectureBookmark} from '../_utils/app-helpers'

  export let classObj=null, url, classes=null, showText=true
  let isBkmk

	$: if($User && !$User.__isLoading && classObj) {
		isBkmk = isBookmark(url || classObj.fields['URL'])
	}



</script>