<template>
  <div>
    <div class="columns">
      <div class="one-half column centered">
        <div class="hero">
          <div class="hero-body">
            <h1 class="title">nuxt firebase auth</h1>
            <h2 class="subtitle">Login to nuxt firebase auth to manage your account</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="one-half column centered">
        <div class="four-fifths">
          <LoginForm/>
        </div>
      </div>
    </div>
  </div>
    <!--</div>  <div class="login">-->
    <!--<section class="container">-->
    <!--<h3>Sign In</h3>-->
    <!--<input type="text" v-model="email" placeholder="Email"><br>-->
    <!--<input type="password" v-model="password" placeholder="Password"><br>-->
    <!--<button v-on:click="signIn">Connection</button>-->
    <!--<button @click="googleLogin">googleでログイン</button>-->
    <!--<button @click="countUp">count up</button>-->
    <!--<p>You don't have an account ? You can-->
    <!--<router-link to="/signup">create one</router-link>-->
    <!--</p>-->
    <!--</section>-->
</template>

<script>
  // import firebase from '@/plugins/firebase'
  // import Vuex from 'vuex'
  //
  // export default {
  //   name: 'login',
  //   data: function () {
  //     return {
  //       email: '',
  //       password: ''
  //     }
  //   },
  //   computed: {
  //     count() {
  //       return store.state.count;
  //     }
  //   },
  //   methods: {
  //     signIn: function () {
  //       firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
  //         (user) => {
  //           this.$router.replace('mypage')
  //         },
  //         (err) => {
  //           alert('Oops. ' + err.message)
  //         }
  //       );
  //     },
  //     googleLogin: function () {
  //       firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(
  //         (user) => {
  //           this.$router.replace('mypage')
  //         },
  //         (err) => {
  //           alert('Oops. ' + err.message)
  //         }
  //       );
  //     },
  //     countUp: () => {
  //       store.commit('increment')
  //       console.log(this.$store.state.count)
  //     }
  //
  //   }
  // }
  import LoginForm from '~/components/account/LoginForm.vue'
  import {mapState} from 'vuex'
  import firebase from '@/plugins/firebase'


  export default {
    middleware: 'anonymous',
    components: {
      LoginForm
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

