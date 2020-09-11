


<footer class="Footer __antialiased __content-footer">
  <div class="Footer-content _section-page _margin-center _padding-top-2 _padding-bottom-2">

    <div class="_padding-bottom-2"><img class="_padding-right" id="logo-moz" src="/mozilla.svg" alt="Mozilla Foundation Logo" /></div>
    <div class="_center _flex-sm _flex-horizontally _margin-bottom-2">
      <img class="_padding-right _margin-bottom-xs" id="logo-p4gh" src="/p4gh.png" alt="Phages for Global Health Logo" />
      <img id="logo-pd" src="/phagedirectory_lrg.png" alt="Phage Directory Logo" />
    </div>

    {@html marked(content)}
    <!-- <div class="_divider-top terms">{@html marked(terms)}</div> -->
  </div>
</footer>






<script>
  import Cytosis from 'cytosis'
  import marked from 'marked'

  // export let segment
  export let Content
  let content, terms

  // $: if(Content) {
  // console.log('Content:', Content)
  content = Cytosis.findOne('footer', Content ).fields['Content']
  // terms = Cytosis.findOne('terms', Content ).fields['Markdown']
  // }
</script>




<style type="text/scss">
  :global(.terms) {
    text-align: left;
  }

  :global(.terms *) {
    font-size: 15px;
  }

  :global(.terms p) {
    line-height: 18px;
  }

  :global(.terms li) {
    margin-bottom: 0px;
  }

  img {
    max-height: 48px;
  }
</style>

