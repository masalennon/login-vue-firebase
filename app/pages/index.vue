<template>
<no-ssr placeholder="Loading...">
  <section class="container">
    <div>
      <div v-if="this.user">
    <p>
      <pre v-text="`${JSON.stringify(user, null, 2)}`"></pre>
    </p>
      </div>
    </div>
  </section>
</no-ssr>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import firebaseApp from "~/firebase/app";
import auth from '~/plugins/auth'

export default {
  computed: {
      ...mapGetters('modules/user', [
        'uid',
        'user'
      ])
  },
  data() {
    return {
      debounceTimer: setTimeout(() => {}),
      formError: "",
      formSuccess: "",
      userName: "",
      userRef : firebaseApp.database().ref('users/' + this.userId),
      loading: true

    };
  },
  async mounted () {
    this.$nextTick( () => {
        this.loading = false
    })
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

