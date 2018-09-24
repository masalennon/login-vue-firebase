<template>
  <div>
    <input v-model="content">
    <input v-model="star">
    <button @click="postReview">Post</button>
    <div v-if="user">
      user is logged in!! {{ userId }}
      {{ this.user.displayName }}
    </div>
 </div>
</template>

<script>
  import firebase from 'firebase'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        content: "",
        star: ""
      }
    },
    name: "post",
    computed: {
      user() {
        return this.$store.state.user
      },
      userId() {
        return firebase.auth().currentUser.uid
      },
      ...mapGetters([
        'user', 
        ]) // storeのGetterとマッピング
    },
    methods: {
      postReview() {
        this.$store.dispatch('postReview', {
          content: this.content,
          star: this.star
        })
        this.star = ''
        this.content = ''
        // firebase.database().ref(`posts/${this.user.uid}`).set({
        //   content: this.content,
        //   star: this.star
        // })
      },
      async doPost () {
        await this.$store.dispatch('ADD_POST', {content: this.content, body: this.star})
        this.body = ''
      }
    }
  }
</script>

<style scoped>

</style>
