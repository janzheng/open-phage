<!--

{#if userFaves && userFaves.length > 0}
  <Masonry class="_divider-top" items={userFaves} bind:refreshLayout={refreshLayout}>
    <!~~ eventually support multiple actives, but for now only one ~~>
    {#each userFaves as fave}
    <!~~ {#each [...faves.active, ...faves.archive] as fave} ~~>
      <FaveThumb {fave} baseId={fave.baseId} showDescription={true} />
    {/each}
  </Masonry>

  <div class="Home-stats _font-small _center _divider-top">
    {userFaves.length} (recent) faves displayed
  </div>
{:else}
  <div class="_section-article _margin-center ">
    <div class="_card _padding ">{$User.userName[0]} has not added a bookmark yet!</div>
  </div>
{/if}


<script>
  import { getContext, onMount } from 'svelte'
  import Masonry from 'svelte-masonry/Masonry.svelte'

  import { cachet } from '../_utils/sapper-helpers';
  import FaveThumb from './FaveThumb.svelte'
  import { User } from '../stores/stores.js';

  export let userFaves, refreshLayout, Faves, profile

  $: if(profile) {
    Faves = cachet({
      key: `profile-faves-${profile.fields['_phid'][0]}`,
      promise: () => fetch(`/api/search?bases=${profile.fields['Collections::active']}&addedBy=${profile.fields['_phid'][0]}`)
        .then(response => response.json()),
      swr: true,
    })
  }


  // $: console.log($User)

  $: if(Faves && $Faves['data']) {
    userFaves = $Faves['data']['data'] // data wrapped in a cachet

    if(refreshLayout)
      refreshLayout()
  }

</script>




<style>
</style>



-->