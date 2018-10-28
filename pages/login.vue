<template>

<body id="LoginForm">
  <div class="container">
    <h1 class="form-heading">login Form</h1>
    <div class="login-form">
      <div class="main-div">
        <div class="panel">
          <h2>Admin Login</h2>
          <p>Please enter your email and password</p>
        </div>
          <form id="Login" v-on:submit.prevent="signin">
              <div class="form-group">
                <input v-model="email" type="email" class="form-control" id="inputEmail" placeholder="Email Address">
                <p class="error" v-if="invalidEmail">This email is invalid</p>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" v-bind:class="{ 'is-danger': invalidPassword }" v-model="password" placeholder="Password"><br>
                <p class="error" v-if="invalidPassword">This password is invalid</p>
              </div>
              <div class="forgot">
                <a href="reset.html">Forgot password?</a>
              </div>
              <button v-on:click="signin" class="btn btn-primary">Login</button>
              <br>
              <google-button/>
              <br>
              <p>You don't have an account ? You can <router-link to="/signup">create one</router-link></p>

          </form>

        </div>
      </div>
    </div>


</body>

</template>

<script>
import { mapState, mapActions } from "vuex";
import firebaseApp, { googleProvider } from "~/firebase/app";
import GoogleButton from "~/components/account/3rd-party/GoogleButton.vue";

export default {
  middleware: "anonymous",
  components: {
    GoogleButton
  },
  data() {
    return {
      email: "",
      password: "",
      formError: "",
      label: "a"
    };
  },
  computed: {
    ...mapState(["user"]),

    invalidEmail() {
      return false; // !this.email.includes('@')
    },
    invalidPassword() {
      return false; // !this.password.length > 12
    }
  },
    methods: {
    ...mapActions('modules/user', [ 'login' ]),
    signin() {
      this.formError = "";
      this.$store
        .dispatch("userLogin", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error);
          this.formError = error.message;
        });
    },
    googleLogin() {
      this.$store.dispatch("userGoogleLogin");
    }
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user(to, from) {
      this.$router.push("/account");
    }
  },
  // computed: mapState(["user"])
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
.login {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.container {
  margin-top: 300px;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}

input {
  margin: 10px 0;
  /* width: 20%; */
  padding: 15px;
}

button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}

p {
  margin-top: 40px;
  font-size: 13px;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}

@import "~/assets/css/bootstrap-social.css";
body#LoginForm {
  background-image: url("https://hdwallsource.com/img/2014/9/blur-26347-27038-hd-wallpapers.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 10px;
}

.form-heading {
  color: #fff;
  font-size: 23px;
}
.panel h2 {
  color: #444444;
  font-size: 18px;
  margin: 0 0 8px 0;
}
.panel p {
  color: #777777;
  font-size: 14px;
  margin-bottom: 30px;
  line-height: 24px;
}
.login-form .form-control {
  background: #f7f7f7 none repeat scroll 0 0;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.main-div {
  background: #ffffff none repeat scroll 0 0;
  border-radius: 2px;
  margin: 10px auto 30px;
  max-width: 38%;
  padding: 50px 70px 70px 71px;
}

.login-form .form-group {
  margin-bottom: 10px;
}
.login-form {
  text-align: center;
}
.forgot a {
  color: #777777;
  font-size: 14px;
  text-decoration: underline;
}
.login-form .btn.btn-primary {
  background: #f0ad4e none repeat scroll 0 0;
  border-color: #f0ad4e;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0;
}
.forgot {
  text-align: left;
  margin-bottom: 30px;
}
.botto-text {
  color: #ffffff;
  font-size: 14px;
  margin: auto;
}
.login-form .btn.btn-primary.reset {
  background: #ff9900 none repeat scroll 0 0;
}
.back {
  text-align: left;
  margin-top: 10px;
}
k.back a {
  color: #444444;
  font-size: 13px;
  text-decoration: none;
}
</style>

