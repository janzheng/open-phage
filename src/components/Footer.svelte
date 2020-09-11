


<footer class="Footer __antialiased __content-footer">
  <div class="Footer-content _section-page _margin-center _padding-top-2 _padding-bottom-2">

    <div class=" _left">

      <div class="_grid-2 _grid-gap-large">
        <div>
          <a href="https://foundation.mozilla.org/" target="_blank"><img class="_margin-bottom" id="logo-moz" src="/mozilla.svg" alt="Mozilla Foundation Logo" /></a>

          <div class="_margin-top _margin-bottom-2">
            <a href="https://www.phagesforglobalhealth.org/" target="_blank"><img class="_padding-right _margin-bottom" id="logo-p4gh" src="/p4gh.jpg" alt="Phages for Global Health Logo" /></a>
            <a href="https://phage.directory" target="_blank"><img id="logo-pd" src="/phagedirectory_lrg.png" alt="Phage Directory Logo" /></a>
          </div>

          {@html marked(content)}
        </div>
        <div class="">
          <div class="_grid-2-xs">
            <div>
              <p><a href="#top">Scroll back to top</a></p>
            </div>
            <div>
              <p><a href="/githublink">Login</a> | <a href="/githublink">Sign Up </a></p>
            </div>
          </div>
          <div class="_grid-2-xs">
            <div>
              <p><a href="/">Home</a></p>
              <p><a href="/lectures">Lectures</a></p>
              <p><a href="/library">Library</a></p>
              <p><a href="/team">Team Members</a></p>
              <p><a href="/terms">Terms & Conditions</a></p>
              <p><a href="/privacy">Privacy Policy</a></p>
              <p><a href="/githublink">Github</a></p>
            </div>
            <div>
            </div>
          </div>
        </div>

      </div>
    </div>


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

  #logo-moz {
    width: 150px;
  }
</style>

