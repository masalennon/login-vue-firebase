<template>
  <form>
    <dl class="form-group">
      <dt><label class="text-inherit">Display Name</label></dt>
      <dd class="control">
        <!-- a<input class="form-control" type="email" placeholder="Display Name" v-model="this.user.displayName" v-on:input="this.user.displayName"> -->
      </dd>
      <div v-if="this.user"> 
        <!-- ↑これがないとcannot read null of emailとかが出る・・・。 -->
        ログインしています
        <input v-model="userName1"/>
        <button v-on:click="updateProfile" class="btn btn-primary">更新</button>
              
      </div>

    </dl>
    <dl class="form-group">
      <dt><label class="text-inherit">Profile Image</label></dt>
      <dd class="control">
        <input class="form-control" type="file" accept="image/*" placeholder="Profile Image" v-on:change="updateProfileImage" ref="fileInput">
      </dd>
    </dl>
    <div class="form-group">
      <div class="flash" v-if="formSuccess.length > 0" v-text="formSuccess"></div>
      <div class="flash flash-error" v-if="formError.length > 0" v-text="formError"></div>
    </div>
    
  </form>

</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";
import { mapGetters } from "vuex";
import auth from '~/plugins/auth'
const db = firebase.database()
const usersRef = db.ref('/users')

export default {
    name: 'EditAccountForm',
    computed: {
      // ...mapState(["user"]),
      // ...mapGetters(['currentUser'])
   
      ...mapState([
        'user'
      ]),
      ...mapGetters([
        'currentUser', //これがないと↓のcurrentUserがundefinedになる
        'userName',
        'email'
      ]),
    },
    data () {
      return {
        image: '',
        debounceTimer: setTimeout(() => {}),
        formError: '',
        formSuccess: '',
        userName1: ''
      }
    },
    created () {
        usersRef.once("value").then((snapshot => {
        var name = snapshot.child(`${this.user.uid}/displayName`).val()
        console.log(name)
        this.userName1 = name
        }))
      
    },
   async mounted () {
      if (process.browser) {
        let user
        if (!this.user) user = await auth()
        await Promise.all([
          this.user ? Promise.resolve() : this.$store.dispatch('setUser', { user: user || null }),
          // this.$store.dispatch('setName')
          
          // this.posts.length ? Promise.resolve() : this.$store.dispatch('INIT_POSTS'), //this.post.lengthがtrueならresolveして次に行くってことだな。syn
          // this.users.length ? Promise.resolve() : this.$store.dispatch('INIT_USERS')
        ])

          
        this.isLoaded = true
      }
    },
    methods: {
      updateProfile () {
          console.log(this.userName)
        firebase.database().ref("users/" + this.user.uid).update(
          {
            displayName: this.userName1,
          }
        )
      },
      resetFormMessages () {
        this.formSuccess = this.formError = ''
      },
      updateField (key) {
        this.resetFormMessages()
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          console.info('update field', key)
          this.$store.dispatch('userUpdate', this.newData)
            .then(() => {
              this.formSuccess = 'Successfully updated your account details'
            })
            .catch((err) => {
              this.formError = 'Error saving the profile changes'
              console.error(err)
            })
        }, 500)
      },
      updateProfileImage () {
        this.resetFormMessages()
        const file = this.$refs.fileInput.files[0]
        const ref = firebase.storage().ref(`accounts/profile/${this.user.uid}`)
        ref.put(file).then((snapshot) => {
          return this.$store.dispatch('userUpdateImage', snapshot.downloadURL)
        })
          .then(() => {
            this.formSuccess = 'Successfully uploaded a new profile image'
            // reset the form input
            this.$refs.fileInput.value = null
          })
          .catch((err) => {
            this.formError = 'Error uploading new profile image'
            console.error(err)
          })
      }
    }
  }
</script>

