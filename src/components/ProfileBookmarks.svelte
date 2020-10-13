<!--

<!~~ pretty much identical to ProfileFaves ~~>

{#if userFaves && userFaves.length>0 && $Faves.data.status}
  <Masonry class="_divider-top" items={userFaves} bind:refreshLayout={refreshLayout}>
    <!~~ eventually support multiple actives, but for now only one ~~>
    {#each userFaves as fave}
    <!~~ {#each [...faves.active, ...faves.archive] as fave} ~~>
      <FaveThumb {fave} baseId={fave.baseId} showDescription={true} />
    {/each}
  </Masonry>
{:else}
  <div class="_section-article _margin-center _divider-bottom">
    <div class="_card _padding ">{$User.userName[0]} has not favorited a bookmark yet!</div>
  </div>
{/if}


<script>
  import { getContext, onMount } from 'svelte'
  import Masonry from 'svelte-masonry/Masonry.svelte'

  import { cachet } from '../_utils/sapper-helpers';
  import FaveThumb from './FaveThumb.svelte'
  import { User } from '../stores/stores.js';

  export let userFaves, refreshLayout, Faves


  $: if(User && $User) {
    let profile = $User.Profile

    let favorites = profile.fields['Favorites'] ? profile.fields['Favorites'].join(',') : undefined

    if(favorites) {
      Faves = cachet({
        key: `userfaves-bookmarks-${profile['_phid']}`,
        promise: () => fetch(`/api/fave?slugs=${favorites}`)
          .then(response => response.json()),
        swr: true,
      })
    } else { // no favorites / should be undefined
      userFaves = null
    }

  }


  $: if(Faves && $Faves['data']) {
    userFaves = $Faves['data']['data']

    if(refreshLayout)
      refreshLayout()
  }

</script>




<style>
</style>



-->