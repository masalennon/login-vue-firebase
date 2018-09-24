<template>
  <section class="container">
    <div>
      <!--{{ this.currentUser.displayName }}-->
      c<div v-if="this.user">
        <!-- {{ this.user.email }} -->
    <p>
      <pre v-text="`${JSON.stringify(user, null, 2)}`"></pre>
    </p>
        <!-- {{ this.user }} -->
        <br>
        <input class="form-control" placeholder="Display Name" v-model="this.user.displayName" v-on:input="this.user.displayName">
        <input class="form-control" placeholder="Display Name" v-model="this.user.email" v-on:input="this.user.displayName">

        <nuxt-link to="/post">投稿する</nuxt-link>
        <nuxt-link to="/account/edit">編集する</nuxt-link>

      </div>
      <div v-else>
        <ul>
        <li><nuxt-link to="/login">ログインする</nuxt-link></li>
        <li><nuxt-link to="/signup">新規登録する</nuxt-link></li>
        </ul>
      </div>
      
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";
import { mapGetters } from "vuex";
import auth from '~/plugins/auth'

export default {
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["currentUser"]),
    // user() {
    //     return this.$store.state.user
    //   },
  },
  data() {
    return {
      debounceTimer: setTimeout(() => {}),
      formError: "",
      formSuccess: "",
      userName: "",
      userRef : firebase.database().ref('users/' + this.userId)

    };
  },
  async mounted () {
      if (process.browser) {
        let user
        if (!this.user) user = await auth()
        await Promise.all([
          this.user ? Promise.resolve() : this.$store.dispatch('setUser', { user: user || null }),
          // this.posts.length ? Promise.resolve() : this.$store.dispatch('INIT_POSTS'), //this.post.lengthがtrueならresolveして次に行くってことだな。syn
          // this.users.length ? Promise.resolve() : this.$store.dispatch('INIT_USERS')
        ])
        this.isLoaded = true
      }
    },
  components: {},
  method: {}
};
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

