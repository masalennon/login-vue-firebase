<template>
  <button type="button" class="btn" v-on:click.prevent="GoogleButton" v-text="label"></button>
</template>

<script>
  import firebase from '@/plugins/firebase'
  export default {
    name: 'GoogleButton',
    props: {
      label: {
        required: true
      }
    },
    methods: {
      GoogleButton () {
        this.$store.dispatch('userGoogleLogin')
      }
    }
  }
</script>

