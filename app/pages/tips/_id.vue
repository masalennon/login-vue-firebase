<template>
    <div>
        {{ userId }}
    </div>
</template>
<script>
export default {
    data() {
        return {
            userId: this.$route.params.id
        }
    },
    head() {
        return {
            title: this.$route.params.id
        }
    }
}
</script>

