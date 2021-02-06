
{#if video}
	{#key video}
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

		{#if captionSrc && viewStarted}
			<div class="caption-container _font-large _padding _padding-top _padding-bottom-2">
				<!-- <div class="caption-header _font-small _padding-bottom-half">Subtitles</div> -->
				{#if cue}
						{cue ? cue.text : ''}
				{/if}
			</div>
		{/if}

		<div class="_font-small">
			{#if download}
				<a href={video}>Download video file</a>
			{/if}
			{#if filesize} ({filesize}) {/if}
			{#if captionSrc}
				— <a href={captionSrc}>Subtitle file</a>
			{/if}
		</div>
	{/key}
{/if}



<script>
	import { _gatrack } from '../_utils/gtag.js';

	export let video, cover=false, filesize=false, captions=false, download=true, width=640, classes="", slug=""
	let videoElem, coverImg, captionSrc
	let track // returns TextTrack
	let activeCues = {} // active text cue
	let cue // active subtitle text
	let viewStarted=false, viewCompleted=false // set to true when play time is close to duration

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

		track = document.getElementById('captions').track;  // returns TextTrack
		track.mode = 'hidden' // hide from video

		videoElem.onplay = () => {
			if(!viewStarted) {
				viewStarted = true
				_gatrack('video_started', {slug})
				_gatrack(`video_started--${slug}`, {slug})
			}

		}

		videoElem.ontimeupdate = () => {
			if(videoElem && videoElem.duration) {
				let duration = videoElem.duration 
				let curtime = videoElem.currentTime
				// console.log('video update: ', curtime, duration, viewCompleted)
				if(!viewCompleted) {
					if(curtime > duration*0.85) {
						viewCompleted = true
						_gatrack('video_watched', {slug})
						_gatrack(`video_watched--${slug}`, {slug})
					}
				}
			}
		}

		// console.log('track?', track)
		track.oncuechange = () => {
			activeCues = track.activeCues
			cue = activeCues[0]; // array of current cues
		}
	}

	// $: if(process.browser && track) {
	// 	// activeCues = track.activeCues
	// 	// text = track.activeCues && track.activeCues[0] ? track.activeCues[0].text : ''
	// }

</script>

<style>
  video {
		max-width: 100%;
		width: 100%;
  }

</style>