<template>
  <div>
    <div class="columns" v-if="user" v-cloak>
      <div class="one-half column centered">
        <div class="blankslate blankslate-clean-background">
          <div class="profile-image centered">
            <a v-bind:href="user.image" class="d-inline-block" target="_blank" title="Click To View">
              <img v-bind:src="user.image" width="100" height="100" v-bind:alt="imageAlt"/>
            </a>
          </div>
          <h3 v-text="user.displayName"></h3>
          <p>View and manage your account</p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="one-half column centered" v-if="editing" v-cloak>
        <p>Edit Your Profile</p>
        <EditAccountForm/>
      </div>
      <div class="one-half column centered" v-else>
        <div v-if="user" v-cloak>
          <p>Information pulled from the firebase <code>/user</code> dataset</p>
          <pre v-text="`${JSON.stringify(user, null, 2)}`"></pre>
                  from user: {{ user.displayName }}
                  from $store.state: {{ this.$store.state.user.displayName }}
                  uid {{ user.key }}
                  uid {{ this.user.key }}
                  <!-- {{ currentUser.uid }} -->
        </div>
        <div v-else> user data is not coming.</div>
      </div>
      <!--なぜここにthisがないとダメなんだ・・・。-->
      <div class="mt-4 one-half column centered">
        <button type="button" class="btn btn-primary mr-2" v-on:click="toggleEditForm">
          <span v-if="editing">Done</span>
          <span v-else>Edit</span>
        </button>
        <button type="button" class="btn btn-danger" v-on:click="signOut">Sign Out</button>
      </div>
      <nuxt-link to="/">トップページへ</nuxt-link>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions, mapGetters } from 'vuex'
  import EditAccountForm from '~/components/account/EditAccountForm.vue'
  import firebaseApp from '~/firebase/app'
  import auth from '~/plugins/auth'
  import localStorage from '~/plugins/localStorage'

  export default {
    // middleware: 'authenticated', // checking if auth'd with firebase kinda sucks as the middleware is triggered before firebase is ready
    components: {
      EditAccountForm
    },
    created (context) {
      // firebase.auth().onAuthStateChanged((user) => {
      //   if(user) {
      //     state.user = user
      //     context.commit('setUser')
      //   }
      // })
    },
    computed: {
      ...mapGetters([
        'currentUser' //これがないと↓のcurrentUserがundefinedになる
      ]),
      // yourName() {
      //   var user = firebase.auth().currentUser
      //   return firebase.database().ref(`/users/${user.uid}/displayName`)
      // },

      // yourid() {
      //   // return firebase.auth().currentUser.uid
      // },
      imageAlt() {
        return `Profile image for ${this.user.displayName}`
      }
    },
    data() {
      return {
        editing: false,

      }
    },
    methods: {
      // ...mapActions(['setUser']),
      toggleEditForm() {
        this.editing = !this.editing
      },
      signOut() {
        this.$store.dispatch('userLogout')
          .then(() => {
            this.$router.push('/login')
          })
          .catch((error) => {
            console.log(error)
          })
      },

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
  }
</script>

<style lang="css" scoped>
  .profile-image img {
    border-radius: 100px;
    overflow: hidden;
    border: 2px solid #b2b1b0;
  }

  pre {
    white-space: pre-wrap;
  }
</style>
