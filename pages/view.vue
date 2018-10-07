<template>
  <div>
      <!-- <div :key="tip.key" v-for="tip in tipList">{{ tip.category }}</div> -->
      <ul id="test">
          <li v-for="tip in tips" :key="tip.key">
              {{tip.content}}
          </li>
      </ul>
    {{tips}}
  </div>
</template>

<script>
import { mapState } from "vuex";

import firebase from "@/plugins/firebase";
export default {
  data() {
    return {
      tips: []
    };
  },
  components: {},
  computed: {
    ...mapState(["user"]),
    tipsList: () => {
      return firebase
        .database()
        .ref("/tips")
        .orderByKey();
    }
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
