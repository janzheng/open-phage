

<!-- pretty much identical to ProfileFaves -->

{#if $Bookmarks && $Bookmarks.data}

  <h6>🌟 Bookmarked Lectures 🌟</h6>
  {#each courseBks as item}
    <div class="Bookmark-item">
      <a href={item.fields['URL']}>{item.fields['Name']}</a>
    </div>
  {/each}

  <h6 class="_margin-top-2">🧪 Bookmarked Protocols 🧪</h6>
  {#each protocolBks as item}
    <div class="Bookmark-item">
      <a href={item.fields['URL']}>{item.fields['Name']}</a>
    </div>
  {/each}

{:else}
  <div class="_section-article _margin-center">
    <div class="_card _padding ">No protocols added yet!</div>
  </div>
{/if}


<script>
  import { getContext, onMount } from 'svelte'
  // import Masonry from 'svelte-masonry/Masonry.svelte'

  import { cachet } from '../_utils/sapper-helpers';
  import FaveThumb from './FaveThumb.svelte'
  import { User } from '../stores/stores.js';

  export let Bookmarks, bkTypes={}, courseBks=[], protocolBks=[]


  $: if(User && $User) {
    let profile = $User.Profile

    let bookmarks = profile.fields['PGH Bookmarks'] ? profile.fields['PGH Bookmarks'].join(',') : undefined

    if(bookmarks && bookmarks.length > 0) {
      let queries = []
      bookmarks.split(',').map(slug => {
        queries.push(`URL|${slug}`)
      })

      Bookmarks = cachet({
        key: `user-bookmarks-${queries.join(', ')}`,
        promise: () => fetch(`/api/notion?getField=${queries.join(', ')}`)
          .then(response => response.json()),
        swr: true,
      })
    } else { // no favorites / should be undefined
      bookmarks = null
    }
  }


  $: {
    console.log('----BBBookmarks?!', $Bookmarks)

    let bkdata = $Bookmarks.data
    bkTypes = {}

    // separates bookmark by content types like "Protocols"
    Object.keys(bkdata).map(b=>{
      console.log('111111 =====', bkdata[b][0])
      let bk = bkdata[b][0]
      if (bk.fields['Content Types'] && bk.fields['Content Types'].length>0) {
        if(!bkTypes[bk.fields['Content Types']])
          bkTypes[bk.fields['Content Types']] = []

        bkTypes[bk.fields['Content Types']].push(bk)

        // add all course bookmarks for ease
        if (bk.fields['Content Types'] == 'Lab Experiment' || 
          bk.fields['Content Types'] == 'Lecture' || 
          bk.fields['Content Types'] == 'Lecture Series' || 
          bk.fields['Content Types'] == 'Lab Videos') {
          courseBks.push(bk)
        }

        if (bk.fields['Content Types'] == 'Protocol')
          protocolBks.push(bk)
      }
    })

    console.log('----bkTypes?!', bkTypes)
  }

  // $: if(Faves && $Faves['data']) {
  //   userFaves = $Faves['data']['data']

  //   if(refreshLayout)
  //     refreshLayout()
  // }

</script>




<style>
</style>



