


<div class="LectureInline">

  <div class="_grid-5-1 _align-vertically _grid-gap">
    <div>
      <a rel=preload href={lecture.fields['URL']}>
        <h3 class="_padding-top-none _padding-bottom-half" data-field="Title">
          {lecture.title[0]}
        </h3>
      </a>
      {#if author}
      <!-- <p data-field="Author">{ classObj.fields['Author'] }</p> -->
      <TeamCard class="_margin-top _margin-bottom" profile={author} inline={true} type="small" />
      {/if}
    </div>
    <div class="_grid-blowout">
      {#if lecture.fields['Video Cover']}
        <a rel=preload href={lecture.fields['URL']}>
          <img src={lecture.fields['Video Cover'][0]} alt="lecture cover" />
        </a>
      {/if}
    </div>
  </div>
  
</div>
  
<script>
  import marked from 'marked';
  import TeamCard from '@/components/TeamCard.svelte'


  export let lecture, authors
  let author

  $: if(authors) {
    let filterAuthor = authors.filter(author => author.fields['Slug'] == lecture.fields['Author'])
    if(filterAuthor && filterAuthor.length > 0)
      author = filterAuthor[0]
    // console.log('[LectureInline] authors', author, authors, lecture)
  }


  // $: console.log('[LectureInline]', lecture)

</script>