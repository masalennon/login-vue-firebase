<template>
<no-ssr placeholder="Loading...">
<body id="">
  <div class="container">
      <div class="row">
          <div class="sessionsLayoutHeader">
            <div class="sessionsLayoutHeader_title text-center">ログイン</div>
          </div>
      </div>
      <hr>
      <div class="row">
          <div id="" class="col-md-6">
              <div class="form-group">
                <el-input v-model="email" type="email" id="inputEmail" placeholder="Email Address"/>
                <p class="error" v-if="invalidEmail">This email is invalid</p>
              </div>
              <div class="form-group">
                <el-input type="password" v-bind:class="{ 'is-danger': invalidPassword }" v-model="password" placeholder="Password"/>
                <div class="forgot">
                <a href="reset.html">Forgot password?</a>
              </div>
                <p class="error" v-if="invalidPassword">This password is invalid</p>
              </div>

              <input type="submit" @click.prevent="twitterLogin" value="ログイン" class="btn btn-primary btn-block btn-lg loginSessionsForm_submit" data-disable-with="Log in">
              <p>You don't have an account ? You can <router-link to="/signup">create one</router-link></p>
          </div>
          <div id="" class="col-md-6">
              <a class="btn btn-twitter-inverse btn-block btn-lg" @click.prevent="twitterLogin">
                <font-awesome-icon v-bind:icon="{ prefix: 'fab', iconName: 'twitter' }" style="color: #FFF; font-size: 22px;"/>
                Twitterでログイン&nbsp;&nbsp;&nbsp;&nbsp;
              </a>
              <a class="btn btn-facebook-inverse btn-block btn-lg" @click.prevent="facebookLogin">
                <font-awesome-icon v-bind:icon="{ prefix: 'fab', iconName: 'facebook' }" style="color: #FFF; font-size: 22px;"/>
                Facebookでログイン
              </a>
              <a class="btn btn-google-inverse btn-block btn-lg" @click.prevent="googleLogin">
                <font-awesome-icon v-bind:icon="{ prefix: 'fab', iconName: 'google' }" style="color: #FFF; font-size: 22px;"/>
                Googleでログイン&nbsp;&nbsp;&nbsp;&nbsp;
              </a>
            </div>
        </div>
    </div>
</body>
</no-ssr>
</template>

<script>
import { mapState, mapActions } from "vuex";
import firebaseApp, { googleProvider, twitterProvider, facebookProvider } from "~/firebase/app";

export default {
  middleware: ['handle-login-route'],
  components: {
  },
  data() {
    return {
      email: "",
      password: "",
      formError: "",
      label: "a",
    };
  },
  computed: {
    // ...mapState(["user"]),

    invalidEmail() {
      return false; // !this.email.includes('@')
    },
    invalidPassword() {
      return false; // !this.password.length > 12
    }
  },
  methods: {
    ...mapActions('modules/user', [ 'login' ]),
    signin () {
      // this.formError = "";
      firebaseApp.auth().signInWithEmailAndPassword(this.email, this.password).then((firebaseUser) => {
        return this.login(firebaseUser.uid) // return should not be necessary here I guess..
      }).then(() => {
        this.$router.push('/protected')
      }).catch((error) => {
        console.log(error.message)
      })
      //前はここでdispatch('login')みたいな感じで、ここではメソッド呼ぶだけだったがこのようにしたら最後どうなるのかが
      //ここ見ただけでわかるようになるし向こうのjsファイルがごちゃごちゃしなくなるからいいな。前はindex.jsに全部書いていたけど
      //今はもうモジュール分けているし。
    },
    async googleLogin() {
      const { user } = await firebaseApp.auth().signInWithPopup(googleProvider)
      await this.login(user)
      this.$router.push('/protected')
    },
    async facebookLogin() {
      const { user } = await firebaseApp.auth().signInWithPopup(facebookProvider)
      await this.login(user)
      this.$router.push('/protected')
    },
    async twitterLogin() {
      // TODO 今はemailが取得できない。するには、↓
      // https://developer.twitter.com/en/apps/15981790　
      // Please add a terms of service URL and privacy policy URL in "App details" to enable additional permissions.
      // とのこと
      const { user } = await firebaseApp.auth().signInWithPopup(twitterProvider)
      await this.login(user)
      this.$router.push('/protected')
    }
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user(to, from) {
      this.$router.push("/protected");
    }
  },
  // computed: mapState(["user"])
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
.container {
    margin-right: auto;
    margin-left: auto;
}
@media (min-width: 1200px) {
  .container {
    width: 940px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 800px;
  }
}
@media only screen and (max-width: 979px) {
  .container {
    width: 70%;
  }
}
@media only screen and (min-width: 321px) and (max-width: 768px) {
  .container {
    width: 100%;
  }
}
@media only screen and (max-width: 320px) {
  .container {
    width: 100%;
  }
}
.btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857;
    border-radius: 3px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.btn-block+.btn-block {
    margin-top: 5px;
}
.btn-twitter-inverse {
    color: #fff !important;
    background-color: #55acee;
    border-color: #2795e9;
}
.btn-facebook-inverse {
    color: #fff !important;
    background-color: #4267B2;
    border-color: #4267B2;
}
.btn-google-inverse {
    color: #fff !important;
    background-color: #c6594b;
    border-color: #a94335;
}
.row:before, .row:after {
    content: " ";
    display: table;
}
.btn-block {
    display: block;
    width: 100%;
}
.btn-lg, .btn-group-lg>.btn {
    padding: 10px 16px;
    font-size: 18px;
    line-height: 1.33333;
    border-radius: 3px;
}
.btn-primary {
    color: #fff;
    background-color: #59bb0c;
    border-color: #4ea30a;
}
.sessionsLayoutHeader_title {
    margin: 30px 0;
    letter-spacing: 1px;
    font-size: 36px;
    font-weight: 400;
}
.text-center {
    text-align: center;
}

.sessionsLayoutHeader {
  width: 100%;
}
hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
}
</style>