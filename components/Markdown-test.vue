<template>
  <div id="main">
    <mavon-editor v-model="value" language="en" />
  </div>
</template>

<script>
  import mavonEditor from 'mavon-editor'

  Vue.use(mavonEditor)
    new Vue({
        'el': '#main',
        data() {
            return { value: '' }
        }
    })

</script>
