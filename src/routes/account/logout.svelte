
<!-- mostly to test the log out code -->

<svelte:head>
	<title>Logout</title>
</svelte:head>


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Log out</h1>

    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div class="logout _divider-bottom">
      <form class="_form-control" on:submit|preventDefault={(e)=>(handleLogout(e))}>
        <button class="_button __action _margin-right-none-i" type="submit">Log Out</button>
      </form>
    </div>
  </div>
</div>
        




<script>
  import { handleLogout } from '../../_utils/auth/sapper-auth-helpers';

</script>




<style type="text/scss">

  form {
    display: flex;
    flex-flow: column;
  }

</style>




