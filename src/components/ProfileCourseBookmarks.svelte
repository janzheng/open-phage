

<!-- pretty much identical to ProfileFaves -->

{#if $Bookmarks && $Bookmarks.data}

  <h6>🌟 Bookmarked Lectures 🌟</h6>
  {#each filteredCourseBks as item}
    <div class="Bookmark-item">
      <a href={item.fields['URL']}>{item.fields['Name']}</a>
    </div>
  {:else}
    No items bookmarked
  {/each}

  <h6 class="_margin-top-2">🧪 Bookmarked Protocols 🧪</h6>
  {#each filteredProtocolBks as item}
    <div class="Bookmark-item">
      <a href={item.fields['URL']}>{item.fields['Name']}</a>
    </div>
  {:else}
    No items bookmarked
  {/each}
  
{:else}
  <div class="_section-article _margin-center">
    <div class="_card _padding _margin-bottom-none">No items bookmarked yet!</div>
  </div>
{/if}






<script>
  import { getContext, onMount } from 'svelte'
  // import Masonry from 'svelte-masonry/Masonry.svelte'

  import { filterByStatus } from '../_utils/app-helpers'
  import { cachet } from '../_utils/sapper-helpers';
  import FaveThumb from './FaveThumb.svelte'
  import { User } from '../stores/stores.js';

  export let Bookmarks, bkTypes={}, courseBks=[], protocolBks=[], filteredCourseBks=[], filteredProtocolBks=[]

  
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
    // console.log('----BBBookmarks?!', $Bookmarks)

    let bkdata
    
    if($Bookmarks && $Bookmarks.data)
      bkdata = $Bookmarks.data

    bkTypes = {}

    if(bkdata) {
      // separates bookmark by content types like "Protocols"
      protocolBks=[]
      courseBks=[]
      Object.keys(bkdata).map(b=>{
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

      filteredCourseBks = filterByStatus(courseBks)
      filteredProtocolBks = filterByStatus(protocolBks)
    }

  }

  // $: if(Faves && $Faves['data']) {
  //   userFaves = $Faves['data']['data']

  //   if(refreshLayout)
  //     refreshLayout()
  // }

</script>




<style>
</style>



