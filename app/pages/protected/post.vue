<template>
  <no-ssr placeholder="Loading...">
  <nuxt-link :to="{ name: 'tips', params: { userId: 123 }}">User</nuxt-link>

  <div class="form-group">
    <label>タイトル</label>
    <input v-model="newParentData.title" type="text" class="form-control" placeholder="タイトル">
  </div>
  <div class="form-group">
    <label>このノウハウを実践するのにかかる金額</label>
    <input v-model="newParentData.price" type="text" class="form-control" placeholder="例：1000円">
  </div>
  <div class="form-group">
    <label>節約できる金額</label>
    <input v-model="newParentData.savedPrice" type="text" class="form-control" placeholder="例：1万円">
  </div>
  <div class="form-group">
    <label>カテゴリ</label>
    <select v-model="newParentData.category" class="form-control">
      <option disabled value="">カテゴリを選んでください</option>
      <option>日用品</option>
      <option>電子機器</option>
    </select>
  </div>
    <button type="submit" class="btn btn-primary" v-on:click="post">Submit</button>
  </no-ssr>
</template>

<script>
import firebaseApp from "~/firebase/app";
import axios from "axios";
import { mapState, mapActions, mapGetters } from "vuex";
import auth from "~/plugins/auth";


const db = firebaseApp.database();
const usersRef = db.ref("/users");
const postsRef = db.ref("/posts");
const tipsRef = db.ref("/tips");
export default {
  data() {
    return {
      newParentData: {
        key: "",
        title: "",
        price: "",
        savedPrice: "",
        category: "",
        content: "",
        file: "",
        star: "",
        reviewNumber: ""
      },
      postList: []
    };
  },
  components: {},
  name: "post",
  middleware: ['authenticated'],
  computed: {
      ...mapGetters('modules/user', [
        'uid',
        'user'
      ])

  },
  created() {
    // tipsRef.on("value", snapshot => {
    //   if (snapshot) {
    //     const rootList = snapshot.val();
    //     let list = [];
    //     Object.keys(rootList).forEach((val, key) => {
    //       rootList[val].id = val;
    //       list.push(rootList[val]);
    //     });
    //     this.postList = list;
    //   }
    // });
  },
  // async mounted () {
  //   if (process.browser) {
  //     let user;
  //     if (!this.user) user = await auth();
  //     await Promise.all([
  //       this.user ? Promise.resolve() : this.$store.dispatch("setUser", { user: user || null })
  //     ]);
  //     this.isLoaded = true;
  //   }
  // },
  methods: {
    fetchPost() {
      tipsRef.on("value", snapshot => {
        if (snapshot) {
          const rootList = snapshot.val();
          let list = [];
          Object.keys(rootList).forEach((val, key) => {
            rootList[val] = val;
            list.push(rootList[val]);
          });
          this.postList = list;
        }
      });
      console.log(this.postList);
      console.log("a");
    },
    post() {
      this.$store.dispatch("postTip", this.newParentData);
    },
    async doPost() {
      await this.$store.dispatch("ADD_POST", {
        content: this.content,
        body: this.star
      });
      this.body = "";
    }
  }
};
</script>

<style scoped>
</style>
