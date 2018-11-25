<template>
<no-ssr placeholder="Loading...">

  <section>
    <div>
      Protected page --- only authenticated users can see this
    </div>
    <div v-if="user">
      <div>
        User ID: {{ uid }}
      </div>
      <!-- <h3>Current User: {{user.name}}</h3> -->
      <!-- <img v-if="user.avatar" :src="user.avatar" alt=""> -->
      <div>
        <!-- All DB Users: {{ allusers }} -->
      </div>
    </div>
        <!-- <font-awesome-icon :icon="faGithub" style="font-size: 40px"/> -->
  </section>
</no-ssr>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import firebaseApp from '~/firebase/app.js'
  export default {
    layout: 'protected',
    data () {
      return {
        allusers: [],
        loading: true
      }
    },
    computed: {
      ...mapGetters('modules/user', [
        'uid',
        'user'
      ]),
    },
    mounted: function () {
      this.$nextTick(() => {
        this.readAllUsersFromDB()
      })
    },
    methods: {
      readAllUsersFromDB() {
        var usersRef = firebaseApp.database().ref('/users')
        usersRef.once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            this.allusers.push(childSnapshot.val())
          })
        })
      }
    }
  }
</script>
