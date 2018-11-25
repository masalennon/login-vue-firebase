<template>
<div>
  <button type="button" class="btn btn-primary btn-google" v-on:click.prevent="GoogleButton">Googleアカウントでログイン</button>
</div>
</template>

<script>

  export default {
    name: 'GoogleButton',
    props: {
    },
    methods: {
      GoogleButton () {
        this.$store.dispatch('userGoogleSignup')
      }
    },
    computed: {
    }
  }
</script>

