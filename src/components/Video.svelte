
{#if video}
	<video class="Video" width="640" controls preload="metadata" bind:this={videoElem}>
	  <source src={video} controls="true" type="video/mp4">
	  Your browser does not support the video tag.
	</video>

	<div class="">
		<a href={video}>Download video file</a>
	</div>
{/if}



<script>

	export let video, videoElem

	$: console.log(videoElem)

	// $: if(videoElem) {
	// 	videoElem.onloadedmetadata = (event) => {
	// 	  console.log('The duration and dimensions of the media and tracks are now known. ', event);
	// 	};
	// }

</script>

<style>
  video {
    max-width: 100%
  }
</style>