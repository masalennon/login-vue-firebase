<template>
<form style="
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    border: 1px solid;
    padding: 50px;
    margin-bottom: 50px;
  ">
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
  <div>
    <mavon-editor ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="newParentData.content" language="en" :toolbars="toolbars" style="height: 100%"></mavon-editor>
    <!-- refとつけることによって、this.$refs.mdとすることによってアクセスすることができるようになる。 -->
  </div>


    <button type="submit" class="btn btn-primary" v-on:click="post">Submit</button>
  </form>
</template>

<script>
import firebaseApp from "~/firebase/app";
import VueMarkdown from "vue-markdown";
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
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        help: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true,
        preview: true,
        // false
        undo: false,
        redo: false,
        fullscreen: false,
        readmodel: false,
        htmlcode: false,
        trash: false,
        save: false,
        navigation: false
      },
      postList: []
    };
  },
  components: {},
  name: "post",
  middleware: ['auth', 'authenticated'],
  computed: {
    user() {
      return this.$store.state.user;
    },
    userId() {
      return firebaseApp.auth().currentUser.uid;
    },
    ...mapState(["user"]),

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
  async mounted () {
    if (process.browser) {
      let user;
      if (!this.user) user = await auth();
      await Promise.all([
        this.user ? Promise.resolve() : this.$store.dispatch("setUser", { user: user || null })
      ]);
      this.isLoaded = true;
    }
  },
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
    $imgAdd(pos, $file) {
      // step 1. upload image to server.
      var formdata = new FormData();
      formdata.append("image", $file);
      axios({
        url: "",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        // step 2. replace url ![...](./0) -> ![...](url)
        // $vm.$img2Url. The details at the end of this page
        $vm.$img2Url(pos, url);
      });
    },
    $imgDel(pos) {
      delete this.img_file[pos];
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
