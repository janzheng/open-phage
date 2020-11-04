
{#if video}
	<!-- <video class="Video" width="640" controls preload="metadata" bind:this={videoElem}> -->
	<video class="Video {classes}" {width} controls preload="none" poster={coverImg} bind:this={videoElem}>
	  <source src={video} controls="true" type="video/mp4">
    <track default
           kind="captions"
           srclang="en"
           src={captionSrc} />
	  Your browser does not support the video tag.
	</video>

	<div class="_font-small">
		{#if download}
			<a href={video}>Download video file</a>
		{/if}
		{#if filesize} ({filesize}) {/if}
	</div>
{/if}



<script>

	export let video, cover=false, filesize=false, captions=false, download=true, width=640, classes=""
	let videoElem, coverImg, captionSrc

	// cover just takes the Notion field array of images
	$: if(cover && cover.length > 0) {
		coverImg = cover[0]
	}
	$: if(captions && captions.length > 0) {
		captionSrc = captions[0]
	}

	// $: console.log('[Video]', video, videoElem, coverImg, filesize, captionSrc)

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