

<div class="TeamCard">

  {#if inline}
    <!-- used as embeds on lecture/class pages -->

    <a class="TeamCard-link" href={`/team#${profile.fields['Slug']}`}>
      <div id={profile.fields['Slug']} class="TeamCard-container __inline ">
        <div class="_grid-1-7 _align-vertically">
          <div>
            {#if profile.fields['Profile Image']}
              <div><img class="profile-img" src={profile.fields['Profile Image Source'] || profile.fields['Profile Image'][0]} alt={`${profile.fields['Name']} profile image`}></div>
            {/if}
          </div>
          <div>
            <div>{profile.fields['Name']}</div>
            <p class="_font-small"><em>{profile.fields['Content Types'].join(',')}</em></p>
          </div>
        </div>
      </div>
    </a>


  {:else if simple}
    <!-- like inline, but smaller and no link -->

    <div id={profile.fields['Slug']} class="TeamCard-container __simple ">
      <div class="_flex">
        <div class="">
          {#if profile.fields['Profile Image']}
            <img class="profile-img" src={profile.fields['Profile Image Source'] || profile.fields['Profile Image'][0]} alt={`${profile.fields['Name']} profile image`}>
          {/if}
        </div>
        <div class="_margin-left _flex-1 _align-vertically">
          {profile.fields['Name']}
          <!-- <p class="_font-small _margin-bottom-none-i"><em>{profile.fields['Content Types'].join(',')}</em></p> -->
        </div>
      </div>
    </div>





  {:else}
    <div id={profile.fields['Slug']} class="TeamCard-container __wide _card _padding">

      <div class="_grid-1-4">
        <div>
          {#if profile.fields['Profile Image']}
            <div><img class="profile-img" src={profile.fields['Profile Image Source'] || profile.fields['Profile Image'][0]} alt={`${profile.fields['Name']} profile image`}></div>
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
        <Video cover={profile.fields['Video Cover']} download={false} filesize={profile.fields['Video Size']} video={profile.fields['Video'][0]} />
        <div class="_margin-top-2">{@html marked(profile.fields['Long'] || '') }</div>
    	{/if}
    </div>
  {/if}


</div>





<script>

  import marked from 'marked';

  import { onMount, getContext, setContext } from 'svelte';
  import Video from './Video.svelte'

  export let profile, inline=false, simple=false

</script>






<style type="text/scss">

</style>
