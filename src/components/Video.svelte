
{#if video}
	<!-- <video class="Video" width="640" controls preload="metadata" bind:this={videoElem}> -->
	<video class="Video {classes}" {width} controls preload="none" poster={coverImg} bind:this={videoElem} crossorigin="anonymous">
	  <source src={video} controls="true" type="video/mp4">
		<track default
					 id="captions"
           kind="captions"
           srclang="en"
           src={captionSrc} />
	  Your browser does not support the video tag.
	</video>

	<div class="caption-container _font-large _padding _padding-top _padding-bottom-2">
		{#if cue}
				{cue ? cue.text : ''}
		{/if}
	</div>

	<div class="_font-small">
		{#if download}
			<a href={video}>Download video file</a>
		{/if}
		{#if filesize} ({filesize}) {/if}
		{#if captionSrc}
			— <a href={captionSrc}>Subtitle file</a>
		{/if}
	</div>
{/if}



<script>

	export let video, cover=false, filesize=false, captions=false, download=true, width=640, classes=""
	let videoElem, coverImg, captionSrc
	let track // returns TextTrack
	let activeCues = {} // active text cue
	let cue // active subtitle text

	// cover just takes the Notion field array of images
	$: if(cover && cover.length > 0) {
		coverImg = cover[0]
	}
	$: if(captions && captions.length > 0) {
		captionSrc = captions[0]
	}
	

	// $: console.log('[Video]', video, videoElem, coverImg, filesize, captionSrc)

	$: if(videoElem && process.browser) {
	// 	// http://ronallo.com/blog/html5-video-caption-cue-settings-tester/
	// 	// 	videoElem.onloadedmetadata = (event) => {
	// 	// 	  console.log('The duration and dimensions of the media and tracks are now known. ', event);
	// 	// 	};
	// 	tracks = videoElem.textTracks
	// 	track = tracks[0]
	// 	activeCues = track.activeCues
	// 	console.log('activeCues.....?!?!!??!?:', track)

	// 	if(videoElem.textTracks[0]['activeCues']) {
	// 		// videoElem.textTracks[0]['activeCues'].text = "banana!!"
	// 		console.log('----***', videoElem.textTracks[0]['activeCues'])
	// 	}
		track = document.getElementById('captions').track;  // returns TextTrack
		track.mode = 'hidden' // hide from video
		track.oncuechange = function () {
			console.log('tracktracktracktracktrack:', track['activeCues'])
			activeCues = track.activeCues
			cue = activeCues[0]; // array of current cues
		}
	}

	$: if(process.browser && track) {
		// activeCues = track.activeCues
		// text = track.activeCues && track.activeCues[0] ? track.activeCues[0].text : ''
	}

</script>

<style>
  video {
    max-width: 100%
  }

	.caption-container {
		background: #eee;
		min-height: 110px;
	}
</style>