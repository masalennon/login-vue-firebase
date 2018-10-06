<template>
  <div>
    <LoginForm/>
  </div>

</template>

<script>

  import LoginForm from '~/components/account/LoginForm.vue'
  import {mapState} from 'vuex'
  import firebase from '@/plugins/firebase'


  export default {
    middleware: 'anonymous',
    components: {
      LoginForm,
    },
    watch: {
      // firebase is sometimes slow so we need to account for
      // the user getting authenticated late in the game...
      user(to, from) {
        this.$router.push('/account')
      }
    },
    computed: mapState([
      'user'
    ])
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
.login {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.container {
  margin-top: 300px;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}

input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}

button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}

p {
  margin-top: 40px;
  font-size: 13px;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}
</style>

