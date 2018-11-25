<template>
  <div class="container">
    <div>
      <nuxt-link to="/">Home</nuxt-link>
      <a href='#' @click="signout">Logout</a>
      <figure class="media-left">
            <p class="image is-64x64">
              <img :src="user.imageUrl">
            </p>
          </figure>
          <nuxt-link to="/protected/post">投稿する</nuxt-link>
          <nuxt-link to="/protected/edit">編集する</nuxt-link>
          <nuxt-link to="protected/">閲覧する</nuxt-link>

    </div>
    <div>
      <nuxt/>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    middleware: 'authenticated',
    methods: {
      ...mapActions('modules/user', [ 'logout' ]),
      async signout () {
        await this.logout()
        this.$router.push('/')

        // this.logout().then(() => {
        //   this.$router.push('/')
        // }).catch((error) => {
        //   console.log(error.message)
        // })
      }
    },
    computed: {
      ...mapGetters('modules/user', [
        'uid',
        'user'
      ])
    }
  }

</script>

<style>
  a {
    padding: 5px;
  }
</style>
