<template>
  <div>
    <header>
      <div>
        <div v-if="!user">
          <nuxt-link to="/signup">新規登録する</nuxt-link>
          <nuxt-link to="/login">ログインする</nuxt-link>
        </div>
        <div v-else>
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="user.imageUrl">
            </p>
          </figure>
          <nuxt-link to="/protected/post">投稿する</nuxt-link>
          <nuxt-link to="/protected/edit">編集する</nuxt-link>
          <nuxt-link to="/protected/">閲覧する</nuxt-link>

        </div>
      </div>
    </header>
    <nuxt/>
    <footer>

    </footer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters('modules/user', [
        'uid',
        'user'
      ])
  },
  methods: {
    ...mapActions(["callAuth"])
  }
};
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>

