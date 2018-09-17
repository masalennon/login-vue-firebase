<template>
  <section class="container">
    <div>
      <!--{{ this.currentUser.displayName }}-->
      <div v-if="this.user.displayName">
        {{ this.user.displayName }}
        {{ this.user }}
        <nuxt-link to="/post">投稿する</nuxt-link>
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

export default {
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["currentUser"])
  },
  data() {
    return {
      newData: {
        displayName: "",
        image: ""
      },
      debounceTimer: setTimeout(() => {}),
      formError: "",
      formSuccess: "",
    };
  },
  mounted() {
    this.newData.displayName = this.user.displayName;
    this.newData.image = this.user.image;
    console.log(this.newData.displayName);
    console.log(this.currentUser.displayName);
    console.log(this.user.displayName);
    console.log();
    console.log();
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

