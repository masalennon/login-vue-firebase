<template>
  <div>
      <!-- <div :key="tip.key" v-for="tip in tipList">{{ tip.category }}</div> -->
          <div v-for="tip in tips" :key="tip.key">
              {{tip.content}}

          </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import firebaseApp from "~/firebase/app";
export default {
  data() {
    return {
      tips: []
    };
  },
  components: {},
  computed: {
    tipsList: () => {
      return firebase
        .database()
        .ref("/tips")
        .orderByKey();
    },
    // compiledMarkdown() {
    //   return marked(this.tips.content, { sanitize: true });
    // },
  },
  created() {
      this.listen()
  },
  methods: {
    listen() {
      this.database = firebase.database()
      this.todosRef = this.database.ref("tips")
      this.todosRef.on("value", snapshot => {
        if (snapshot) {
          const rootList = snapshot.val();
          let list = [];
          Object.keys(rootList).forEach((val, key) => {
            rootList[val].id = val;
            list.push(rootList[val]);
          });
          this.tips = list;
        }
      });
    }
  }
};
</script>
