<template>
  <div>
    <Edit/>
  </div>
 
</template>

<script>
  import firebase from 'firebase'
  import { mapGetters } from 'vuex'
  import Edit from "~/components/account/EditAccountForm.vue";
  import { mapState } from 'vuex'
  import auth from '~/plugins/auth'



  export default {
    components: { Edit },
    data() {
      return {
        
      }
    },
    computed: {
      userId() {
        return firebase.auth().currentUser.uid
      },
      ...mapState(["user"]),
    //   ...mapGetters([
    //     'currentUser', 
    //     ]) // storeのGetterとマッピング
    },
    methods: {
      
    },
  }
</script>

<style scoped>

</style>