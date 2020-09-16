<div class="_card _padding">
  <div class="_grid-1-4">
    <div>
      {#if profile.fields['Profile Image']}
        <div><img class="profile-img" src={profile.fields['Profile Image'][0]} alt={`${profile.fields['Name']} profile image`}></div>
      {/if}
    </div>
    <div>
      <h3>{profile.fields['Name']}</h3>
      <p><em>{profile.fields['Content Types'].join(',')}</em></p>
      <div>{@html marked(profile.fields['Short'] || '')}</div>
      {#if !profile.fields['Video'] }
        <div class="_margin-top-2">{@html marked(profile.fields['Long'] || '') }</div>
      {/if}
    </div>

  </div>
	{#if profile.fields['Video'] && profile.fields['Video'][0]}
    <Video video={profile.fields['Video'][0]} />
    <div class="_margin-top-2">{@html marked(profile.fields['Long'] || '') }</div>
	{/if}


</div>



<script>

  import marked from 'marked';

  import { onMount, getContext, setContext } from 'svelte';
  import Video from './Video.svelte'

  export let profile

</script>






<style type="text/scss">

  .profile-img {
    width: 100%;
    max-width: 150px;
    border-radius: 100%;

  }
</style>
