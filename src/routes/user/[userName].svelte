
<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    // const res = await this.fetch(`api/profile?slug=${params.slug}`)

    // console.log('PRELOAD grabbing user ', params.userName)
    // const _result = await this.fetch(`api/profile?userName=${params.userName}`).then(r => r.json())

    const _result = await this.fetch(`api/profile?slug=${params.userName}`).then(r => r.json())


    // console.log('PRELOAD result:', _result)
    return {profile: _result.data, userName: params.userName }
  }
</script>

        
<div class="_section-content _margin-center">
  <div class="_section-article _margin-center">
    {#if profile && profile.fields }
      <div class="_divider-top _divider-bottom" >
        <ProfileRender Profile={ profile } />
      </div>
    {:else}
      <div class="_card _padding _divider-top">
        Profile not found for "{userName}"
      </div>
    {/if}
  </div>
</div>


{#if profile}
  <!-- <ProfileFaves {profile} /> -->
{/if}


<script>
  import { getContext, onMount } from 'svelte'
  import Cytosis from 'cytosis';

  import FaveThumb from '../../components/FaveThumb.svelte'
  import ProfileRender from '../../components/ProfileRender.svelte'
  import ProfileFaves from '../../components/ProfileFaves.svelte'

  export let profile, userName

  const Content = getContext('Content')
  
</script>



<style>
</style>



