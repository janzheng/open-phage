


<footer class="Footer __antialiased __content-footer">
  <div class="Footer-content _section-page _margin-center _padding-top-2 _padding-bottom-2">

    <div class=" _left">

      <div class="_grid-2 _grid-gap-large">
        <div>
          <a href="https://foundation.mozilla.org/" target="_blank"><img class="_margin-bottom" id="logo-moz" src="/mozilla.svg" alt="Mozilla Foundation Logo" /></a>

          <div class=" _margin-bottom-2">
            <p><a href="https://www.phagesforglobalhealth.org/" target="_blank"><img class="_padding-right" id="logo-p4gh" src="/p4gh.jpg" alt="Phages for Global Health Logo" /></a></p>
            <p><a href="https://phage.directory" target="_blank"><img id="logo-pd" src="/phagedirectory_lrg.png" alt="Phage Directory Logo" /></a></p>
          </div>

          {@html marked(content)}
        </div>
        <div class="">
          <div class=" _grid-2-xs">
            <div>
              <p><a href="#top" on:click={(e)=>{e.preventDefault(); scrollToAnchor('top')}}>Scroll back to top</a></p>
            </div>
            <div>
              <p><a href="/login">Login</a></p>
              <p><a href="/signup">Sign Up </a></p>
            </div>
          </div>
          <div class="_grid-2-xs">
            <div>
              <p><a href="/">Home</a></p>
              <p><a href="/lectures">Lectures</a></p>
              <p><a href="/library">Library</a></p>
              <p><a href="/team">Team Members</a></p>
              <p><a href="/community">Community Rules</a></p>
              <p><a href="/terms">Terms & Conditions</a></p>
              <p><a href="/privacy">Privacy Policy</a></p>
              <p><a href="https://github.com/janzheng/open-phage">Github</a></p>
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

  import { scrollToAnchor } from '@/_utils/scrollto'

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

  a {
    display: inline-block;
  }

  img {
    max-height: 48px;
    // display: block;
  }

  #logo-moz {
    width: 150px;
  }
</style>

