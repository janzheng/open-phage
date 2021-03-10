<header>

  <!-- First container -->
  <div class="container container_solid">
    <div class="title_wrapper">
      <h1>Restore<br> balance</h1>
    </div>
  </div>

  <!-- Second container -->
  <div class="container container_image" aria-hidden="true">
    <div class="title_wrapper">
      <h1>Restore<br> balance</h1>
    </div>
  </div>

</header>

<section>
  <h2>Lorem ipsum dolor sit amet.</h2>
  <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
  </p>
</section>



<style type="text/scss">


@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@900&display=swap');

header {
  height: 200vh;
}

.container {
  /* hide fixed overflow contents */
  clip: rect(0, auto, auto, 0);

  /* does not work if overflow = visible */
  overflow: hidden;

  /* only works with absolute positioning */
  position: absolute;

  /* Make sure containers are full-width and height */
  height: 100vh;
  left: 0;
  width: 100%;
  
  
  /* safari hack */
  -webkit-mask-image: -webkit-linear-gradient(top, #ffffff 0%,#ffffff 100%);
}

.container_solid {
  background: white;
  
  /* position this container at the top of its parent element */
  top: 0;
}

.title_wrapper {
  position: fixed;
  display: block;  
  margin: auto;
  width: 100%;
  /* center the text wrapper vertically */
  top: 50%;
  -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
          transform: translateY(-50%);
}

.title_wrapper h1 {
  text-align: center;
  font-size: 128px;
  line-height: 132px;
  text-transform: uppercase;
  text-align: center;
  font-family: 'Fraunces', serif;
  font-weight: 900;
}

.container_solid .title_wrapper h1 {
  /* the text background */
  background: url(https://images.unsplash.com/photo-1440020143730-090579c4d53c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1360&q=80);
  background-size: 100vw auto;
  background-position: center;
  
  /* clip the text is possible */
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  
  /* fallback text color */
  color: black;
}

.container_image {
  /* Grab a free image from unsplash */
  background-image: url(https://images.unsplash.com/photo-1440020143730-090579c4d53c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1360&q=80);
  background-size:100vw auto;
  background-position: center;
  background-attachment: fixed;
  
  /* position the second container below the first container */
  top: 100vh;
}

.container_image .title_wrapper h1 {
  color: white;
  opacity: 0.66;
}

section {
  min-height: 100vh;
  padding: 2em;
  margin: auto;
  max-width: 800px;
}

section h2 {
  font-family: 'Fraunces', serif;
}

section p {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}


</style>